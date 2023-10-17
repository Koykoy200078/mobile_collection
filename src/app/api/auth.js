import { showError } from '../components/AlertMessage'
import { BASE_URL, LOGIN_URL } from '../config/url'

export function* userLogin(payload) {
	const { password, username } = payload
	try {
		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		}

		const response = yield fetch(
			LOGIN_URL + `/mobile-api/login?username=${username}&password=${password}`,
			options
		)
		const data = yield response.json()

		if (response.ok) {
			return data
		} else {
			showError({
				message: 'Login Failed',
				description: data.message,
			})
			throw new Error(data.message)
		}
	} catch (error) {
		throw new Error('An error occurred during login.')
	}
}
