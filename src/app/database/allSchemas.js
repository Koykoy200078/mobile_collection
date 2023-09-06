// CLIENT
export const Client = 'Client'
const Collection = 'Collection'

export const ClientSchema = {
	name: Client,
	primaryKey: 'client_id',
	properties: {
		branch_id: { type: 'int' },
		client_id: { type: 'int' },
		FName: { type: 'string' },
		LName: { type: 'string' },
		MName: { type: 'string', optional: true },
		SName: { type: 'string', optional: true },
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
		REF: { type: 'int', optional: true },
		SLDESCR: { type: 'string' },
		REF_TARGET: { type: 'string' },
		REF_SOURCE: { type: 'string' },
		PRINCIPAL: { type: 'string' },
		BALANCE: { type: 'string' },
		PRINDUE: { type: 'string' },
		INTDUE: { type: 'string' },
		PENDUE: { type: 'string' },
		INSDUE: { type: 'string' },
		TOTALDUE: { type: 'string' },
		is_default: { type: 'int' },
	},
}

// UPLOAD
export const UploadData = 'UploadData'
const UploadDataCollection = 'UploadDataCollection'

export const uploadSchema = {
	name: UploadData,
	primaryKey: 'client_id',
	properties: {
		branch_id: { type: 'int' },
		client_id: { type: 'int' },
		FName: { type: 'string' },
		LName: { type: 'string' },
		MName: { type: 'string', optional: true },
		SName: { type: 'string', optional: true },
		collections: { type: 'list', objectType: UploadDataCollection },
	},
}

export const uploadDataCollection = {
	name: UploadDataCollection,
	properties: {
		BRCODE: { type: 'int' },
		SLC: { type: 'int' },
		SLT: { type: 'int' },
		REF: { type: 'int', optional: true },
		SLDESCR: { type: 'string' },
		REF_TARGET: { type: 'string' },
		REF_SOURCE: { type: 'string' },
		PRINCIPAL: { type: 'string' },
		BALANCE: { type: 'string' },
		PRINDUE: { type: 'string' },
		INTDUE: { type: 'string' },
		PENDUE: { type: 'string' },
		INSDUE: { type: 'string' },
		TOTALDUE: { type: 'string' },
		ACTUAL_PAY: { type: 'string' },
		REMARKS: { type: 'string' },
		is_default: { type: 'int' },
	},
}

const allSchema = [
	ClientSchema,
	CollectionSchema,
	uploadSchema,
	uploadDataCollection,
]

const databaseOptions = {
	path: 'CollectorList.realm',
	schema: allSchema,
	schemaVersion: 1,
}

export default databaseOptions
