import {all} from 'redux-saga/effects';

import {loginUser} from './auth';
import {batchDetails} from './batchDetails';

export default function* rootSaga() {
  yield all([
    // auth/login
    loginUser(),

    batchDetails(),
  ]);
}
