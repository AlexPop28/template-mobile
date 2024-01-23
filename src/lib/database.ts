import * as SQLite from "expo-sqlite";
// TODO update import
import { Model } from "../model/model";

// TODO update names
const database_name = "database";
const table_name = "table_name";

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
  console.log("DB: Checking if the table exists");
  const result = await executeSql(
    `SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?`,
    [table_name],
  );
  return result.rows.length > 0;
};

let created = false;
const create = async (): Promise<void> => {
  if (!created) {
    const tableDoesExist = await doesTableExist();
    // await executeSql(`DROP TABLE ${table_name}`);
    if (!tableDoesExist) {
      // TODO fill out the model details for the database
      console.log("DB: creating the table");
      await executeSql(
        `CREATE TABLE IF NOT EXISTS ${table_name}(id INT, has_data INT)`,
      );
    } else {
      console.log("DB: table already exists");
    }
    created = true;
  }
};

const getAll = async (): Promise<Model[]> => {
  console.log("DB: trying getAll");
  try {
    await create();

    const result = await executeSql(`SELECT * FROM ${table_name}`);
    console.log("DB: getAll successful");
    return result.rows._array.map((obj: Model) => {
      // TODO convert from database representation to in-memory representation
      return obj;
    });
  } catch (e: any) {
    console.log("DB: getAll failed:", e);
    throw e;
  }
};

const getById = async (id: number): Promise<Model> => {
  console.log("DB: trying getById");
  try {
    await create();
    const result = await executeSql(
      `SELECT * FROM ${table_name} WHERE id = ?`,
      [id],
    );
    console.log("DB: getById successful");
    return result.rows.item(0);
  } catch (e: any) {
    console.log("DB: getById failed:", e);
    throw e;
  }
};

const add = async (obj: Model): Promise<void> => {
  console.log("DB: trying add");
  try {
    await create();
    // TODO add all fields; double check the order of the arguments
    await executeSql(`INSERT INTO ${table_name} (id, has_data) VALUES (?, ?)`, [
      obj.id,
      1,
    ]);
    console.log("DB: add successful");
  } catch (e: any) {
    console.log("DB: add failed:", e);
    throw e;
  }
};

const update = async (obj: Model): Promise<void> => {
  console.log("DB: trying update");
  try {
    await create();
    // TODO update the fields; double check the order or the arguments
    await executeSql(`UPDATE ${table_name} SET field = ? WHERE id = ?`, [
      "field",
      obj.id,
    ]);
    console.log("DB: update successful");
  } catch (e: any) {
    console.log("DB: update failed:", e);
    throw e;
  }
};

const remove = async (id: number) => {
  console.log("DB: trying remove");
  try {
    await create();
    await executeSql(`DELETE FROM ${table_name} WHERE id = ?`, [id]);
    console.log("DB: remove successful");
  } catch (e: any) {
    console.log("DB: remove failed:", e);
    throw e;
  }
};

export { add, doesTableExist, getAll, getById, remove, update };
