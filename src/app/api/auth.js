import {BASE_URL} from '../config/url';

export function* userLogin(payload) {
  try {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...payload}),
    };

    const response = yield fetch(BASE_URL + 'mobile-api/login', options);
    const data = yield response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.errors);
    }
  } catch (error) {
    throw new Error('An error occurred during login.');
  }
}
