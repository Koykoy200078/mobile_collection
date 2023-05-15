import Realm from 'realm';

export const CollectorList = 'CollectorList';

export const collectorList = {
  name: CollectorList,
  primaryKey: 'id',
  properties: {
    id: {type: 'int', default: 0, min: 0},
    name: {type: 'string', default: '', indexed: true},
    description: {type: 'string', default: ''},
    principal: {type: 'string', default: ''},
    interest: {type: 'string', default: ''},
    penalty: {type: 'string', default: ''},
  },
};

const databaseOptions = {
  path: 'collectorList.realm',
  schema: [CollectorList],
  schemaVersion: 0,
};

// export const insertNewTodoList = newTodoList =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         realm.write(() => {
//           realm.create(TODOLIST_SCHEMA, newTodoList);
//           resolve(newTodoList);
//         });
//       })
//       .catch(error => reject(error));
//   });

// export const updateTodoList = todoList =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         realm.write(() => {
//           let updatingTodoList = realm.objectForPrimaryKey(
//             TODOLIST_SCHEMA,
//             todoList.id,
//           );
//           updatingTodoList.name = todoList.name;
//           resolve();
//         });
//       })
//       .catch(error => reject(error));
//   });

// export const deleteTodoList = todoListId =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         realm.write(() => {
//           let deletingTodoList = realm.objectForPrimaryKey(
//             TODOLIST_SCHEMA,
//             todoListId,
//           );
//           realm.delete(deletingTodoList);
//           resolve();
//         });
//       })
//       .catch(error => reject(error));
//   });

// export const deleteAllTodoList = () =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         realm.write(() => {
//           let allTodoList = realm.objects(TODOLIST_SCHEMA);
//           realm.delete(allTodoList);
//           resolve();
//         });
//       })
//       .catch(error => reject(error));
//   });

// export const queryAllTodoList = () =>
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then(realm => {
//         realm.write(() => {
//           let allTodoList = realm.objects(TODOLIST_SCHEMA);
//           resolve(allTodoList);
//         });
//       })
//       .catch(error => reject(error));
//   });

// export default new Realm(databaseOptions);
