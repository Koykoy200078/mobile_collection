// CLIENT
export const Client = 'Client'
export const Collection = 'Collection'

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
		ID: { type: 'int' },
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
		trans_datetime: { type: 'string' },
		is_default: { type: 'int' },
	},
}

// UPLOAD
export const UploadData = 'UploadData'
export const UploadDataCollection = 'UploadDataCollection'
export const UploadTOP = 'UploadTypeOfPayment'

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
		REF_NO: { type: 'string' },
		collections: { type: 'list', objectType: UploadDataCollection },
		COCI: { type: 'list', objectType: UploadTOP },
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
		STATUS: { type: 'int' }, // 1 - Active, 4 - Cancelled, 5 - Disapproved
		is_default: { type: 'int' },
	},
}

export const topSchema = {
	name: UploadTOP,
	properties: {
		TYPE: 'string',
		AMOUNT: 'string',
		CHECK_NUMBER: { type: 'int', optional: true },
		BANK_CODE: { type: 'string', optional: true },
		CHECK_TYPE: { type: 'string', optional: true },
		CLEARING_DAYS: { type: 'string', optional: true },
		DATE_OF_CHECK: { type: 'string', optional: true },
	},
}

// COLLECTION REPORT
export const CollectionReport = 'CollectionReport'

export const collectionReportSchema = {
	name: CollectionReport,
	primaryKey: 'TRANSID',
	properties: {
		TRANSID: { type: 'int' },
		TRANS_REFNO: { type: 'string' },
		DSHBRD_REFNO: { type: 'string' },
		REF_TARGET: { type: 'string' },
		REF_SOURCE: { type: 'string' },
		CLIENTID: { type: 'int' },
		CLIENT_NAME: { type: 'string' },
		ACTUAL_PAY: { type: 'string' },
		TYPE_OF_PAYMENT: { type: 'string' },
		TRANS_DATETIME: { type: 'string' },
	},
}

// AMOUNT UPLOAD
export const totalAmountUpload = 'totalAmountUpload'
export const lastAmountSchema = {
	name: totalAmountUpload,
	properties: {
		amount: { type: 'string' },
	},
}

const allSchema = [
	ClientSchema,
	CollectionSchema,
	uploadSchema,
	uploadDataCollection,
	topSchema,
	collectionReportSchema,
	lastAmountSchema,
]

const databaseOptions = {
	path: 'CollectorList.realm',
	schema: allSchema,
	schemaVersion: 1,
}

export default databaseOptions
