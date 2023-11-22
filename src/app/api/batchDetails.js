import { showError } from '../components/AlertMessage'
import { BASE_URL } from '../config/url'
import { select } from 'redux-saga/effects'

export function* getBatchDetails(payload) {
	const { branchid, collectorid } = payload
	const auth = yield select((state) => state.auth.authData.data.token)

	try {
		const options = {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Access-Token': '6JlK9vK0I8FNb2paCPxl',
				Authorization: auth,
			},
		}
		const response = yield fetch(
			BASE_URL +
				`/dashboard/download/collection/details?branchid=${branchid}&collectorid=${collectorid}`,
			options
		)
		const data = yield response.json()
		if (response.ok) {
			return data
		} else {
			throw new Error(data)
		}
	} catch (error) {
		console.log('Error: ', error)
	}
}
