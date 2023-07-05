import {BASE_URL} from '../config/url';
import {select} from 'redux-saga/effects';

export function* getBatchDetails(payload) {
  const {branchid, collectorid, clientid, slclass = '12,13'} = payload;
  const auth = yield select(state => state.auth.authData.data.token);

  try {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Token': '6JlK9vK0I8FNb2paCPxl',
        Authorization: auth,
      },
    };
    const response = yield fetch(
      BASE_URL +
        `/mobile-api/collector/collection/batch-details?branchid=${branchid}&collectorid=${collectorid}&clientid=${clientid}&slclass=${slclass}`,
      options,
    );
    const data = yield response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  } catch (error) {
    console.log('Error: ', error);
  }
}
