export const Collection = 'Collection'

export const Client = 'Client'

export const ClientSchema = {
	name: Client,
	primaryKey: 'ClientID',
	properties: {
		ClientIDBrCode: { type: 'int' },
		ClientID: { type: 'int' },
		Fullname: { type: 'string' },
		isPaid: { type: 'bool', default: false },
		collections: { type: 'list', objectType: Collection },
	},
}

export const CollectionSchema = {
	name: Collection,
	properties: {
		BRCODE: { type: 'int' },
		SLC: { type: 'int' },
		SLT: { type: 'int' },
		REF: { type: 'int' },
		SLDESCR: { type: 'string' },
		REF_TARGET: { type: 'string' },
		PRINCIPAL: { type: 'string' },
		BALANCE: { type: 'string' },
		PRINDUE: { type: 'string' },
		INTDUE: { type: 'string' },
		PENDUE: { type: 'string' },
		INSDUE: { type: 'string' },
		TOTALDUE: { type: 'string' },
		is_default: { type: 'bool' },
	},
}

// upload data
export const UploadData = 'UploadData'
export const UploadDataCollection = 'UploadDataCollection'
export const uploadSchema = {
	name: UploadData,
	primaryKey: 'ClientID',
	properties: {
		ClientID: { type: 'int' },
		FName: { type: 'string', optional: true },
		LName: { type: 'string', optional: true },
		MName: { type: 'string', optional: true },
		SName: { type: 'string', optional: true },
		DateOfBirth: { type: 'string', optional: true },
		SMSNumber: { type: 'string', optional: true },
		collections: { type: 'list', objectType: UploadDataCollection },
	},
}

export const uploadDataCollection = {
	name: UploadDataCollection,
	properties: {
		BRCODE: { type: 'int' },
		SLC: { type: 'int' },
		SLT: { type: 'int' },
		REF: { type: 'int' },
		SLDESCR: { type: 'string' },
		REF_TARGET: { type: 'string' },
		AMT: { type: 'string' },
		REMARKS: { type: 'string' },
	},
}

const databaseOptions = {
	path: 'CollectorList.realm',
	schema: [ClientSchema, CollectionSchema, uploadSchema, uploadDataCollection],
	schemaVersion: 1,
}

export const getSchema = [
	ClientSchema,
	CollectionSchema,
	uploadSchema,
	uploadDataCollection,
]
export default databaseOptions
