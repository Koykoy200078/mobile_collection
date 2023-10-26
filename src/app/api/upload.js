import { BASE_URL } from '../config/url'
import { select } from 'redux-saga/effects'
import databaseOptions, {
	CollectionReport,
	UploadData,
} from '../database/allSchemas'
import { showError, showInfo, showSuccess } from '../components/AlertMessage'
import { Realm } from '@realm/react'

const saveHistory = async (item) => {
	try {
		const realm = await Realm.open(databaseOptions)
		realm.write(() => {
			item.transactions.forEach((transaction) => {
				const collectionReport = {
					TRANSID: transaction.TRANSID,
					TRANS_REFNO: transaction.TRANS_REFNO,
					DSHBRD_REFNO: transaction.DSHBRD_REFNO,
					REF_TARGET: transaction.REF_TARGET,
					REF_SOURCE: transaction.REF_SOURCE,
					CLIENTID: transaction.CLIENTID,
					CLIENT_NAME: transaction.CLIENT_NAME,
					ACTUAL_PAY: transaction.ACTUAL_PAY,
					TRANS_DATETIME: transaction.TRANS_DATETIME,
				}
				console.log(JSON.stringify(collectionReport, null, 2))
				realm.create(
					CollectionReport,
					collectionReport,
					Realm.UpdateMode.Modified
				)
			})
		})

		showInfo({
			message: 'Success',
			description: 'Uploading data successfully!',
		})
	} catch (error) {
		showError({
			message: 'Error',
			description: 'Error updating data!',
		})
		console.error('Error saving history: ', error)
	}
}

export function* uploadDetails(payload) {
	const { token } = yield select((state) => state.auth.authData.data)
	try {
		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Access-Token': '6JlK9vK0I8FNb2paCPxl',
				Authorization: token,
			},
			body: JSON.stringify(payload),
		}
		const response = yield fetch(
			BASE_URL + '/dashboard/upload/collection/data',
			options
		)
		const data = yield response.json()
		if (response.ok) {
			saveHistory(data)
			return data
		} else {
			throw new Error(data)
		}
	} catch (error) {
		console.log('Error: ', error)
	}
}
