import {all} from 'redux-saga/effects';

import {batchDetails} from './batchDetails';

export default function* rootSaga() {
  yield all([
    // auth/login
    // loginUser(),

    batchDetails(),
  ]);
}
