import {put, call, takeEvery} from 'redux-saga/effects';
import {Alert} from 'react-native';
import {
  UPLOAD_DATA,
  UPLOAD_DATA_COMPLETED,
  UPLOAD_DATA_ERROR,
  UPLOAD_DATA_REQUEST,
} from '../api/actions';
import {uploadDetails} from '../api/upload';

export function* uploadDataAsync(action) {
  yield put({type: UPLOAD_DATA_REQUEST});

  try {
    const response = yield call(uploadDetails, action.payload);

    if (response !== undefined && response.error) {
      yield put({type: UPLOAD_DATA_ERROR, response});
      Alert.alert('Error', response.message);
    } else {
      yield put({type: UPLOAD_DATA_COMPLETED, response});
    }
  } catch (error) {
    console.error(error);
  }
}

export function* uploadData() {
  yield takeEvery(UPLOAD_DATA, uploadDataAsync);
}
