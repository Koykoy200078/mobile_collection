package coop.sacredheart.collector.iMinPrinter;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;

import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

public class ArrayUtils {

    public static JSONArray toJSONArray(ReadableArray readableArray) throws JSONException {
        JSONArray jsonArray = new JSONArray();

        for (int i = 0; i < readableArray.size(); i++) {
            ReadableType type = readableArray.getType(i);

            switch (type) {
                case Null:
                    jsonArray.put(i, null);
                    break;
                case Boolean:
                    jsonArray.put(i, readableArray.getBoolean(i));
                    break;
                case Number:
                    jsonArray.put(i, readableArray.getDouble(i));
                    break;
                case String:
                    jsonArray.put(i, readableArray.getString(i));
                    break;
                case Map:
                    jsonArray.put(i, MapUtils.toJSONObject(readableArray.getMap(i)));
                    break;
                case Array:
                    jsonArray.put(i, ArrayUtils.toJSONArray(readableArray.getArray(i)));
                    break;
            }
        }

        return jsonArray;
    }

    public static Object[] toArray(JSONArray jsonArray) throws JSONException {
        Object[] array = new Object[jsonArray.length()];

        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);

            if (value instanceof JSONObject) {
                value = MapUtils.toMap((JSONObject) value);
            }
            if (value instanceof JSONArray) {
                value = ArrayUtils.toArray((JSONArray) value);
            }

            array[i] = value;
        }

        return array;
    }

    public static Object[] toArray(ReadableArray readableArray) {
        Object[] array = new Object[readableArray.size()];

        for (int i = 0; i < readableArray.size(); i++) {
            ReadableType type = readableArray.getType(i);

            switch (type) {
                case Null:
                    array[i] = null;
                    break;
                case Boolean:
                    array[i] = readableArray.getBoolean(i);
                    break;
                case Number:
                    array[i] = readableArray.getDouble(i);
                    break;
                case String:
                    array[i] = readableArray.getString(i);
                    break;
                case Map:
                    array[i] = MapUtils.toMap(readableArray.getMap(i));
                    break;
                case Array:
                    array[i] = ArrayUtils.toArray(readableArray.getArray(i));
                    break;
            }
        }

        return array;
    }

    public static WritableArray toWritableArray(Object[] array) {
        WritableArray writableArray = Arguments.createArray();

        for (Object value : array) {
            if (value == null) {
                writableArray.pushNull();
            }
            if (value instanceof Boolean) {
                writableArray.pushBoolean((Boolean) value);
            }
            if (value instanceof Double) {
                writableArray.pushDouble((Double) value);
            }
            if (value instanceof Integer) {
                writableArray.pushInt((Integer) value);
            }
            if (value instanceof String) {
                writableArray.pushString((String) value);
            }
            if (value instanceof Map) {
                writableArray.pushMap(MapUtils.toWritableMap((Map<String, Object>) value));
            }
            if (value.getClass().isArray()) {
                writableArray.pushArray(ArrayUtils.toWritableArray((Object[]) value));
            }
        }

        return writableArray;
    }

    public static String[] toArrayOfString(ReadableArray readableArray) {
        String[] array = new String[readableArray.size()];

        for (int i = 0; i < readableArray.size(); i++) {
            ReadableType type = readableArray.getType(i);
            array[i] = readableArray.getString(i);
        }

        return array;
    }
    // public static String[] toArrayOfString(ReadableArray readableArray) {
    // String[] array = new String[readableArray.size()];

    // for (int i = 0; i < readableArray.size(); i++) {
    // ReadableType type = readableArray.getType(i);
    // if (type == ReadableType.Array) {
    // ReadableArray innerArray = readableArray.getArray(i);
    // StringBuilder stringBuilder = new StringBuilder();
    // for (int j = 0; j < innerArray.size(); j++) {
    // if (j > 0) {
    // stringBuilder.append(" "); // Add space between elements
    // }
    // stringBuilder.append(innerArray.getString(j));
    // }
    // array[i] = stringBuilder.toString();
    // } else {
    // array[i] = readableArray.getString(i);
    // }
    // }

    // return array;
    // }

    public static int[] toArrayOfInteger(ReadableArray readableArray) {
        int[] array = new int[readableArray.size()];

        for (int i = 0; i < readableArray.size(); i++) {
            ReadableType type = readableArray.getType(i);
            array[i] = readableArray.getInt(i);
        }

        return array;
    }
}