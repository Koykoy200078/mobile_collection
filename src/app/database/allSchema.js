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

const databaseOptions = {
  path: 'collectorList.realm',
  schema: [ClientSchema, CollectionSchema],
  schemaVersion: 1,
};

export const getSchema = [ClientSchema, CollectionSchema];
export default databaseOptions;
