import {BASE_URL} from '../config/url';

export function* userLogin(payload) {
  const {password, username} = payload;
  try {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const response = yield fetch(
      BASE_URL + `/mobile-api/login?username=${username}&password=${password}`,
      options,
    );
    const data = yield response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error('An error occurred during login.');
  }
}
