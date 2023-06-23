import {BASE_URL} from '../config/url';

export function* getBatchDetails(payload) {
  const {branchid, collectorid, clientid, slclass = '12,13'} = payload;
  try {
    let auth =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJiX2lkIjoiMCIsImNfaWQiOiIxIiwibl9kIjoiUm9nZWxpbyBQYXJheWFvIiwiaWF0IjoxNjg3NTA2MjI1LCJleHAiOjE2ODc1MDgwMjV9.mM44NY3C4l0DaQBWoZ1wVmFrFVV6L-d_OMkG0q8s7bI';
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
      throw new Error(data.errors);
    }
  } catch (error) {
    console.log('Error: ', error);
  }
}
