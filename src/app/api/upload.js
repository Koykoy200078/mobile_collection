import {BASE_URL} from '../config/url';
import {select} from 'redux-saga/effects';

export function* uploadDetails(payload) {
  console.log('payload: ', payload);
  //   const {token, branchid, collectorid} = yield select(
  //     state => state.auth.authData.data,
  //   );

  //   try {
  //     const options = {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //         'Access-Token': '6JlK9vK0I8FNb2paCPxl',
  //         Authorization: token,
  //       },
  //       body: body,
  //     };
  //     const response = yield fetch(BASE_URL + '', options); // &clientid=${clientid}&slclass=${slclass}

  //     const data = yield response.json();
  //     if (response.ok) {
  //       return data;
  //     } else {
  //       throw new Error(data);
  //     }
  //   } catch (error) {
  //     console.log('Error: ', error);
  //   }
}
