export const Collection = 'Collection';

export const Client = 'Client';

export const ClientSchema = {
  name: Client,
  primaryKey: 'ClientID',
  properties: {
    ClientID: 'int',
    FName: 'string?',
    LName: 'string?',
    MName: 'string?',
    SName: 'string?',
    DateOfBirth: 'string?',
    SMSNumber: 'string?',
    isPaid: {type: 'bool', default: false},
    collections: {type: 'list', objectType: Collection},
  },
};

export const CollectionSchema = {
  name: Collection,
  properties: {
    BRCODE: 'int',
    SLC: 'int',
    SLT: 'int',
    REF: 'int',
    SLDESCR: 'string',
    REF_TARGET: 'string',
    PRINCIPAL: 'string',
    BALANCE: 'string',
    PRINDUE: 'string',
    INTDUE: 'string',
    PENDUE: 'string',
    INSDUE: 'string',
    TOTALDUE: 'string',
  },
};

// upload data
export const UploadData = 'UploadData';
export const UploadDataCollection = 'UploadDataCollection';
export const uploadSchema = {
  name: UploadData,
  primaryKey: 'ClientID',
  properties: {
    ClientID: 'int',
    FName: 'string?',
    LName: 'string?',
    MName: 'string?',
    SName: 'string?',
    DateOfBirth: 'string?',
    SMSNumber: 'string?',
    collections: {type: 'list', objectType: UploadDataCollection},
  },
};

export const uploadDataCollection = {
  name: UploadDataCollection,
  properties: {
    BRCODE: 'int',
    SLC: 'int',
    SLT: 'int',
    REF: 'int',
    SLDESCR: 'string',
    REF_TARGET: 'string',
    AMT: 'string',
    REMARKS: 'string',
  },
};

const databaseOptions = {
  path: 'CollectorList.realm',
  schema: [ClientSchema, CollectionSchema, uploadSchema, uploadDataCollection],
  schemaVersion: 1,
};

export const getSchema = [
  ClientSchema,
  CollectionSchema,
  uploadSchema,
  uploadDataCollection,
];
export default databaseOptions;
