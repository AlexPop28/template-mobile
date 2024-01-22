import * as SQLite from "expo-sqlite";
// TODO update import
import { Model } from "../model/model";

// TODO update names
const database_name = "database";
const table_name = "table";

const db = SQLite.openDatabase(`${database_name}.db`);

const executeSql = (sql: string, params: (string | number)[] = []) =>
  new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error): any => reject(error),
      );
    });
  });

const doesTableExist = async (): Promise<boolean> => {
  const result = await executeSql(
    `SELECT name FROM sqlite_master WHERE type = 'table' AND name = '${table_name}';`,
  );
  return result.rows.length > 0;
};

let created = false;
const create = async (): Promise<void> => {
  if (!created) {
    // await executeSql(`DROP TABLE ${table_name}`);
    if (!doesTableExist()) {
      // TODO fill out the model details for the database
      await executeSql(
        `CREATE TABLE IF NOT EXISTS ${table_name}(id INT, has_data INT)`,
      );
    }
    created = true;
  }
};

const getAll = async (): Promise<Model[]> => {
  await create();
  const result = await executeSql(`SELECT * FROM ${table_name}`);
  return result.rows._array.map((obj: Model) => {
    // TODO convert from database representation to in-memory representation
    return obj;
  });
};

const getById = async (id: number): Promise<Model> => {
  await create();
  const result = await executeSql(`SELECT * FROM ${table_name} WHERE id = ?`, [
    id,
  ]);
  return result.rows.item(0);
};

const add = async (obj: Model): Promise<void> => {
  await create();
  // TODO add all fields; double check the order of the arguments
  await executeSql(`INSERT INTO ${table_name} (id, has_data) VALUES (?, ?)`, [
    obj.id,
    1,
  ]);
};

const update = async (obj: Model): Promise<void> => {
  await create();
  // TODO update the fields; double check the order or the arguments
  await executeSql(`UPDATE ${table_name} SET field = ? WHERE id = ?`, [
    "field",
    obj.id,
  ]);
};

const remove = async (id: number) => {
  await create();
  await executeSql(`DELETE FROM ${table_name} WHERE id = ?`, [id]);
};

export { add, doesTableExist, getAll, getById, remove, update };
