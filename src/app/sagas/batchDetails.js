import {put, call, takeEvery} from 'redux-saga/effects';
import {getBatchDetails} from '../api/batchDetails';
import {
  GET_BATCH_DETAILS,
  GET_BATCH_DETAILS_COMPLETED,
  GET_BATCH_DETAILS_ERROR,
  GET_BATCH_DETAILS_REQUEST,
} from '../api/actions';

export function* batchDetailsAsync(action) {
  yield put({type: GET_BATCH_DETAILS_REQUEST});

  try {
    const response = yield call(getBatchDetails, action.payload);

    if (response !== undefined && response.errors) {
      yield put({type: GET_BATCH_DETAILS_ERROR, response});
      console.log('response error ==> ', response);
    } else {
      yield put({type: GET_BATCH_DETAILS_COMPLETED, response});
      console.log('response complete ==> ', response);
    }
  } catch (error) {
    console.error(error);
  }
}

export function* batchDetails() {
  yield takeEvery(GET_BATCH_DETAILS, batchDetailsAsync);
}
