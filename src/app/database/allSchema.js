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
    ID: 'string',
    CLIENTNAME: 'string',
    SLDESCR: 'string',
    REF_NO: 'string',
    PRINCIPAL: 'string',
    BALANCE: 'string',
    PRINDUE: 'string',
    INTDUE: 'string',
    PENDUE: 'string',
    INSDUE: 'string',
    TOTALDUE: 'string',
    SHARECAPITAL: 'string',
    DEPOSIT: 'string',
  },
};

export const updatedCollectionDataSchema = 'updatedCollectionData';
export const updatedClientDataSchema = 'updatedClientData';
export const updatedClientData = {
  name: updatedClientDataSchema,
  primaryKey: 'ClientID',
  properties: {
    ClientID: 'int',
    FName: 'string?',
    LName: 'string?',
    MName: 'string?',
    SName: 'string?',
    DateOfBirth: 'string?',
    SMSNumber: 'string?',
    collections: {type: 'list', objectType: updatedCollectionDataSchema},
  },
};
export const updatedCollectionData = {
  name: updatedCollectionDataSchema,
  properties: {
    ID: 'string',
    CLIENTNAME: 'string',
    SLDESCR: 'string',
    REF_NO: 'string',
    PRINCIPAL: 'string',
    BALANCE: 'string',
    PRINDUE: 'string',
    INTDUE: 'string',
    PENDUE: 'string',
    INSDUE: 'string',
    TOTALDUE: 'string',
    SHARECAPITAL: 'string',
    DEPOSIT: 'string',
  },
};

const databaseOptions = {
  path: 'collectorList.realm',
  schema: [
    ClientSchema,
    CollectionSchema,
    updatedClientData,
    updatedCollectionData,
  ],
  schemaVersion: 1,
};

export const getSchema = [
  ClientSchema,
  CollectionSchema,
  updatedClientData,
  updatedCollectionData,
];
export default databaseOptions;
