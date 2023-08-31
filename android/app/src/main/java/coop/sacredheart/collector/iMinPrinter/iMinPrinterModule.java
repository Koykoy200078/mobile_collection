package coop.sacredheart.collector.iMinPrinter;

import android.Manifest;
import android.app.Activity;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.hardware.display.DisplayManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.View;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.imin.library.SystemPropManager;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.imin.printerlib.IminPrintUtils;
import com.imin.printerlib.util.BluetoothUtil;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class iMinPrinterModule extends ReactContextBaseJavaModule {

    private static final String TAG = "IminInnerPrinterModule";

    private static ReactApplicationContext reactContext;
    private IminPrintUtils.PrintConnectType connectType = null;
    private final IminPrintUtils mIminPrintUtils;
    private final List<String> connectTypeList;

    public iMinPrinterModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        mIminPrintUtils = IminPrintUtils.getInstance(context);
        connectTypeList = new ArrayList<>();

        String deviceModel = SystemPropManager.getModel();
        Log.d("deviceModel", deviceModel);
        if (TextUtils.equals("M2-202", deviceModel) || TextUtils.equals("M2-203", deviceModel)
                || TextUtils.equals("M2-Pro", deviceModel)) {
            connectTypeList.add("SPI");
            connectTypeList.add("Bluetooth");
        } else if (TextUtils.equals("S1-701", deviceModel) || TextUtils.equals("S1-702", deviceModel)) {
            connectTypeList.add("USB");
            connectTypeList.add("Bluetooth");
        } else if (TextUtils.equals("D1p-601", deviceModel) || TextUtils.equals("D1p-602", deviceModel)
                || TextUtils.equals("D1p-603", deviceModel) || TextUtils.equals("D1p-604", deviceModel)
                || TextUtils.equals("D1w-701", deviceModel) || TextUtils.equals("D1w-702", deviceModel)
                || TextUtils.equals("D1w-703", deviceModel) || TextUtils.equals("D1w-704", deviceModel)
                || TextUtils.equals("D4-501", deviceModel) || TextUtils.equals("D4-502", deviceModel)
                || TextUtils.equals("D4-503", deviceModel) || TextUtils.equals("D4-504", deviceModel)
                || TextUtils.equals("D4-505", deviceModel) || TextUtils.equals("M2-Max", deviceModel)
                || TextUtils.equals("D1", deviceModel) || TextUtils.equals("D1-Pro", deviceModel)
                || TextUtils.equals("Swift 1", deviceModel) || TextUtils.equals("I22T01", deviceModel)) {
            connectTypeList.add("USB");
            connectTypeList.add("Bluetooth");
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "iMinPrinterModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        return new HashMap<>();
    }

    @ReactMethod
    public void initPrinter() {
        if (connectTypeList.contains("USB")) {
            connectType = IminPrintUtils.PrintConnectType.USB;
            mIminPrintUtils.initPrinter(IminPrintUtils.PrintConnectType.USB);
            show("Connect USB Success", Toast.LENGTH_SHORT);
        } else if (connectTypeList.contains("SPI")) {
            connectType = IminPrintUtils.PrintConnectType.SPI;
            mIminPrintUtils.initPrinter(IminPrintUtils.PrintConnectType.SPI);
            show("Connect SPI Success", Toast.LENGTH_SHORT);
        } else if (connectTypeList.contains("Bluetooth")) {
            if (BluetoothUtil.isBluetoothOn()) {
                try {
                    connectType = IminPrintUtils.PrintConnectType.BLUETOOTH;
                    BluetoothDevice device = BluetoothUtil.getPairedDevices().get(0);
                    mIminPrintUtils.initPrinter(IminPrintUtils.PrintConnectType.BLUETOOTH, device);
                    show("Connect Bluetooth Success", Toast.LENGTH_SHORT);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } else {
                BluetoothUtil.openBluetooth(getCurrentActivity());
            }
        } else {
            show("Unknown's Device", Toast.LENGTH_SHORT);
        }
    }

    @ReactMethod
    public void getStatus(Callback successCallback) {
        int status = IminPrintUtils.getInstance(reactContext).getPrinterStatus(connectType);
        successCallback.invoke(status);
        String deviceModel = SystemPropManager.getModel();
        show(deviceModel + ":" + status, Toast.LENGTH_SHORT);
    }

    @ReactMethod
    public void getSn(Callback successCallback) {
        String sn = "";
        if (Build.VERSION.SDK_INT >= 30) {
            sn = SystemPropManager.getSystemProperties("persist.sys.imin.sn");
        } else {
            sn = SystemPropManager.getSn();
        }
        successCallback.invoke(sn);
    }

    @ReactMethod
    public void printText(String text, Callback successCallback) {
        IminPrintUtils mIminPrintUtils = IminPrintUtils.getInstance(reactContext);
        mIminPrintUtils.printText(text + "   \n");
        successCallback.invoke("print text: " + text);
    }

    /**
     * @param size    Font Size (default 28)
     * @param promise
     */
    @ReactMethod
    public void setTextSize(int size, final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        final int mSize = size;
        ThreadPoolManager.getInstance().executeTask(() -> {
            try {
                printUtils.setTextSize(mSize);
                promise.resolve(null);
            } catch (Exception e) {
                e.printStackTrace();
                Log.i(TAG, "ERROR: " + e.getMessage());
                promise.reject("" + 0, e.getMessage());
            }
        });
    }

    @ReactMethod
    public void printAndLineFeed(final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        ThreadPoolManager.getInstance().executeTask(() -> {
            try {
                printUtils.printAndLineFeed();
                promise.resolve(null);
            } catch (Exception e) {
                e.printStackTrace();
                Log.i(TAG, "ERROR: " + e.getMessage());
                promise.reject("" + 0, e.getMessage());
            }
        });
    }

    /**
     * @param height  0 - 255
     * @param promise
     */
    @ReactMethod
    public void printAndFeedPaper(int height, final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        final int mHeight = height;
        ThreadPoolManager.getInstance().executeTask(() -> {
            try {
                printUtils.printAndFeedPaper(mHeight);
                promise.resolve(null);
            } catch (Exception e) {
                e.printStackTrace();
                Log.i(TAG, "ERROR: " + e.getMessage());
                promise.reject("" + 0, e.getMessage());
            }
        });
    }

    @ReactMethod
    public void partialCut(final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        ThreadPoolManager.getInstance().executeTask(() -> {
            try {
                printUtils.partialCut();
                promise.resolve(null);
            } catch (Exception e) {
                e.printStackTrace();
                Log.i(TAG, "ERROR: " + e.getMessage());
                promise.reject("" + 0, e.getMessage());
            }
        });
    }

    @ReactMethod
    public void show(String message, int duration) {
        Toast toast = Toast.makeText(getReactApplicationContext(), message, duration);
        toast.show();
    }

}