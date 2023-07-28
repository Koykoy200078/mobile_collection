import {put, call, takeEvery} from 'redux-saga/effects';
import {getBatchDetails} from '../api/batchDetails';
import {Alert} from 'react-native';
import {
  GET_BATCH_DETAILS,
  GET_BATCH_DETAILS_COMPLETED,
  GET_BATCH_DETAILS_ERROR,
  GET_BATCH_DETAILS_REQUEST,
} from '../api/actions';

export function* batchDetailsAsync(action) {
  try {
    yield put({type: GET_BATCH_DETAILS_REQUEST});
    const response = yield call(getBatchDetails, action.payload);

    if (response !== undefined && response.error) {
      yield put({type: GET_BATCH_DETAILS_ERROR, response});
      Alert.alert('Error', response.message);
    } else {
      yield put({type: GET_BATCH_DETAILS_COMPLETED, response});
    }
  } catch (error) {
    console.error(error);
  }
}

export function* batchDetails() {
  yield takeEvery(GET_BATCH_DETAILS, batchDetailsAsync);
}
