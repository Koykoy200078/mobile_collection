import {BASE_URL} from '../config/url';

export function* getBatchDetails(payload) {
  const {branchid, collectorid, clientid, slclass} = payload;
  try {
    let auth =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJiX2lkIjoiMCIsImNfaWQiOiIxIiwibl9kIjoiUm9nZWxpbyBQYXJheWFvIiwiaWF0IjoxNjg3NDIzMzEyLCJleHAiOjE2ODc0MjUxMTJ9.viuG9u0StzIeZcfNUB273QMit8ZMvPf_OqdILfh1_eA';
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
        `/mobile-api/collector/collection/batch-details?branchid=${branchid}&collectorid=${collectorid}&clientid=${clientid}`,
      options,
    );
    const data = yield response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.errors);
    }
  } catch (error) {
    console.log('Error: ', error);
  }
}
