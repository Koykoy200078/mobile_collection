package coop.sacredheart.collector.iMinPrinter;

import android.bluetooth.BluetoothDevice;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Paint;
import android.os.Build;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.imin.library.IminSDKManager;
import com.imin.library.SystemPropManager;
import com.imin.printerlib.IminPrintUtils;
import com.imin.printerlib.util.BluetoothUtil;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class iMinPrinterModule extends ReactContextBaseJavaModule {
    public static final String NAME = "IminPrinter";
    private static final String TAG = "IminInnerPrinterModule";
    private static ReactApplicationContext reactContext;
    private IminPrintUtils.PrintConnectType connectType = IminPrintUtils.PrintConnectType.USB;
    private final IminPrintUtils mIminPrintUtils;
    private final List<String> connectTypeList;

    public iMinPrinterModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        mIminPrintUtils = IminPrintUtils.getInstance(context);
        connectTypeList = new ArrayList<>();

        String deviceModel = SystemPropManager.getModel();
        Log.d("deviceModel",deviceModel);
        if (TextUtils.equals("M2-202", deviceModel) || TextUtils.equals("M2-203", deviceModel) || TextUtils.equals("M2-Pro", deviceModel)) {
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
                || TextUtils.equals("D1", deviceModel) || TextUtils.equals("D1-Pro", deviceModel) || TextUtils.equals("Swift 1", deviceModel) || TextUtils.equals("I22T01", deviceModel)) {
            connectTypeList.add("USB");
            connectTypeList.add("Bluetooth");
        }
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
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
                    mIminPrintUtils.initPrinter(IminPrintUtils.PrintConnectType.BLUETOOTH,device);
                    show("Connect Bluetooth Success", Toast.LENGTH_SHORT);
                }catch (IOException e){
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
        int status =
                IminPrintUtils.getInstance(reactContext).getPrinterStatus(connectType);
        successCallback.invoke(status);
        String deviceModel = SystemPropManager.getModel();
        show(deviceModel + ":" +status, Toast.LENGTH_SHORT);
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

//    @ReactMethod
//    public void printText(String text, Callback successCallback) {
//        IminPrintUtils mIminPrintUtils = IminPrintUtils.getInstance(reactContext);
//        mIminPrintUtils.printText(text + "   \n");
//        successCallback.invoke("print text: " + text);
//    }

    @ReactMethod
    public void printText(String text, final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        final String mText = text;
        ThreadPoolManager.getInstance().executeTask(new Runnable() {
            @Override
            public void run() {
                try {
                    printUtils.printText(mText);
                    promise.resolve(null);
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.i(TAG, "ERROR: " + e.getMessage());
                    promise.reject("" + 0, e.getMessage());
                }
            }
        });
    }

    @ReactMethod
    public void printAndLineFeed(final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        ThreadPoolManager.getInstance().executeTask(new Runnable() {
            @Override
            public void run() {
                try {
                    printUtils.printAndLineFeed();
                    promise.resolve(null);
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.i(TAG, "ERROR: " + e.getMessage());
                    promise.reject("" + 0, e.getMessage());
                }
            }
        });
    }

    /**
     * @param height    0 - 255
     * @param promise
     */
    @ReactMethod
    public void printAndFeedPaper(int height, final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        final int mHeight = height;
        ThreadPoolManager.getInstance().executeTask(new Runnable() {
            @Override
            public void run() {
                try {
                    printUtils.printAndFeedPaper(mHeight);
                    promise.resolve(null);
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.i(TAG, "ERROR: " + e.getMessage());
                    promise.reject("" + 0, e.getMessage());
                }
            }
        });
    }

    @ReactMethod
    public void partialCut(final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        ThreadPoolManager.getInstance().executeTask(new Runnable() {
            @Override
            public void run() {
                try {
                    printUtils.partialCut();
                    promise.resolve(null);
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.i(TAG, "ERROR: " + e.getMessage());
                    promise.reject("" + 0, e.getMessage());
                }
            }
        });
    }

    /**
     * @param alignment   0 = Left, 1 = Center, 2 = Right (default 0)
     * @param promise
     */
    @ReactMethod
    public void setAlignment(int alignment, final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        final int mAlignment = alignment;
        ThreadPoolManager.getInstance().executeTask(new Runnable() {
            @Override
            public void run() {
                try {
                    printUtils.setAlignment(mAlignment);
                    promise.resolve(null);
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.i(TAG, "ERROR: " + e.getMessage());
                    promise.reject("" + 0, e.getMessage());
                }
            }
        });
    }

    /**
     * @param size      Font Size (default 28)
     * @param promise
     */
    @ReactMethod
    public void setTextSize(int size, final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        final int mSize = size;
        ThreadPoolManager.getInstance().executeTask(new Runnable() {
            @Override
            public void run() {
                try {
                    printUtils.setTextSize(mSize);
                    promise.resolve(null);
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.i(TAG, "ERROR: " + e.getMessage());
                    promise.reject("" + 0, e.getMessage());
                }
            }
        });
    }

    /**
     * @param style      0 = Normal, 1 = Bold, 2 = Italic, 3 = Bold Italic
     * @param promise
     */
    @ReactMethod
    public void setTextStyle(int style, final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        final int mStyle = style;
        ThreadPoolManager.getInstance().executeTask(new Runnable() {
            @Override
            public void run() {
                try {
                    printUtils.setTextStyle(mStyle);
                    promise.resolve(null);
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.i(TAG, "ERROR: " + e.getMessage());
                    promise.reject("" + 0, e.getMessage());
                }
            }
        });
    }

    @ReactMethod
    public void printTextWordWrap(String text, final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        final String mText = text;
        ThreadPoolManager.getInstance().executeTask(new Runnable() {
            @Override
            public void run() {
                try {
                    printUtils.printText(mText, 1);
                    promise.resolve(null);
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.i(TAG, "ERROR: " + e.getMessage());
                    promise.reject("" + 0, e.getMessage());
                }
            }
        });
    }

    /**
     * @param textArray       Text Array (String)
     * @param widthArray      Width of each Column, must be greater than 0 (Int)
     * @param alignArray      Alignment Array (0 = Left, 1 = Center, 2 = Right)
     * @param fontSizeArray   Font Size of each Column
     * @param promise
     */
    @ReactMethod
    public void printColumnsText(ReadableArray textArray, ReadableArray widthArray,
                                 ReadableArray alignArray, ReadableArray fontSizeArray,
                                 final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        final String[] mTextArray = ArrayUtils.toArrayOfString(textArray);
        final int[] mWidthArray = ArrayUtils.toArrayOfInteger(widthArray);
        final int[] mAlignArray = ArrayUtils.toArrayOfInteger(alignArray);
        final int[] mFontSizeArray = ArrayUtils.toArrayOfInteger(fontSizeArray);
        ThreadPoolManager.getInstance().executeTask(new Runnable() {
            @Override
            public void run() {
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        printUtils.printColumnsText(mTextArray, mWidthArray, mAlignArray, mFontSizeArray);
                    }
                    promise.resolve(null);
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.i(TAG, "ERROR: " + e.getMessage());
                    promise.reject("" + 0, e.getMessage());
                }
            }
        });
    }

    @ReactMethod
    public void openCashBox(final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        ThreadPoolManager.getInstance().executeTask(new Runnable() {
            @Override
            public void run() {
                try {
                    IminSDKManager.opencashBox();
                    promise.resolve(null);
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.i(TAG, "ERROR: " + e.getMessage());
                    promise.reject("" + 0, e.getMessage());
                }
            }
        });
    }

    /**
     * @param data      Base64 Image Data
     * @param promise
     */
    @ReactMethod
    public void printSingleBitmap(String data, final Promise promise) {
        final IminPrintUtils printUtils = mIminPrintUtils;
        byte[] decoded = Base64.decode(data, Base64.DEFAULT);
        final Bitmap bitmap = invert(BitmapFactory.decodeByteArray(decoded, 0, decoded.length));

        ThreadPoolManager.getInstance().executeTask(new Runnable() {
            @Override
            public void run() {
                try {
                    printUtils.printSingleBitmap(bitmap, 1);
                    promise.resolve(null);
                } catch (Exception e) {
                    e.printStackTrace();
                    Log.i(TAG, "ERROR: " + e.getMessage());
                    promise.reject("" + 0, e.getMessage());
                }
            }
        });
    }



    protected Bitmap invert(Bitmap src)
    {
        int height = src.getHeight();
        int width = src.getWidth();

        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        Paint paint = new Paint();

        ColorMatrix matrixGrayscale = new ColorMatrix();
        matrixGrayscale.setSaturation(0);

        ColorMatrix matrixInvert = new ColorMatrix();
        matrixInvert.set(new float[]
                {
                        -1.0f, 0.0f, 0.0f, 0.0f, 255.0f,
                        0.0f, -1.0f, 0.0f, 0.0f, 255.0f,
                        0.0f, 0.0f, -1.0f, 0.0f, 255.0f,
                        0.0f, 0.0f, 0.0f, 1.0f, 0.0f
                });
        matrixInvert.preConcat(matrixGrayscale);

        ColorMatrixColorFilter filter = new ColorMatrixColorFilter(matrixInvert);
        paint.setColorFilter(filter);

        canvas.drawBitmap(src, 0, 0, paint);
        return bitmap;
    }

    @ReactMethod
    public void show(String message, int duration) {
        Toast toast = Toast.makeText(getReactApplicationContext(), message, duration);
        toast.show();
    }

}