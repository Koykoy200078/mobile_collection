import {put, call, takeEvery} from 'redux-saga/effects';
import {Alert} from 'react-native';
import {userLogin} from '../api/auth';
import {
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
} from '../api/actions';

export function* loginUserAsync(action) {
  yield put({type: USER_LOGIN_REQUEST});

  try {
    const response = yield call(userLogin, action.payload);

    if (response !== undefined && response.error) {
      yield put({type: USER_LOGIN_ERROR, response});
      Alert.alert('Error', response.message);
    } else {
      yield put({type: USER_LOGIN_COMPLETED, response});
    }
  } catch (error) {
    yield put({type: USER_LOGIN_ERROR, error});
  }
}

export function* loginUser() {
  yield takeEvery(USER_LOGIN, loginUserAsync);
}
