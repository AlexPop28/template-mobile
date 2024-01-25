import * as SQLite from "expo-sqlite";
// TODO update import
import { Model } from "../model/model";

// TODO update names
const database_name = "database";
const table_name = "table_name";
// const categories_table_name = "categories_table";

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
// const doesCategoriesTableExist = async (): Promise<boolean> => {
//   console.log("DB: Checking if the categories table exists");
//   const result = await executeSql(
//     `SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?`,
//     [categories_table_name],
//   );
//   return result.rows.length > 0;
// };

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
// const create = async (): Promise<void> => {
//   if (!created) {
//     const categoriesTableDoesExist = await doesCategoriesTableExist();
//     const tableDoesExist = await doesTableExist();
//     // await executeSql(`DROP TABLE ${categories_table_name}`);
//     // await executeSql(`DROP TABLE ${table_name}`);
//     if (!categoriesTableDoesExist) {
//       // TODO fill out the model details for the database
//       console.log("DB: creating the categories table");
//       await executeSql(
//         `CREATE TABLE IF NOT EXISTS ${categories_table_name}(category TEXT, has_data INT)`,
//       );
//     } else {
//       console.log("DB: categories table already exists");
//     }

//     if (!tableDoesExist) {
//       console.log("DB: creating the table");
//       await executeSql(
//         `CREATE TABLE IF NOT EXISTS ${table_name}(id INT, name TEXT, description TEXT, image TEXT, category TEXT, units INT, price REAL, has_data INT)`,
//       );
//     } else {
//       console.log("DB: table already exists");
//     }

//     created = true;
//   }
// };

const getAll = async (): Promise<Model[]> => {
  const funcName = `getAll`;
  console.log(`DB: trying ${funcName}`);
  try {
    await create();

    const result = await executeSql(`SELECT * FROM ${table_name}`);
    console.log(`DB: successful ${funcName}`);
    return result.rows._array.map((obj: Model) => {
      // TODO convert from database representation to in-memory representation
      return obj;
    });
  } catch (e: any) {
    console.log(`DB: failed ${funcName}`, e);
    throw e;
  }
};

// const getAllCategories = async (): Promise<Category[]> => {
//   const funcName = `getAllCategories`;
//   console.log(`DB: trying ${funcName}`);
//   try {
//     await create();

//     const result = await executeSql(`SELECT * FROM ${categories_table_name}`);
//     console.log(`DB: successful ${funcName}`);
//     return result.rows._array.map((obj: Category) => {
//       // TODO convert from database representation to in-memory representation
//       return obj;
//     });
//   } catch (e: any) {
//     console.log(`DB: failed ${funcName}`, e);
//     throw e;
//   }
// };

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
  const funcName = `add(${obj})`;
  console.log(`DB: trying ${funcName}`);
  try {
    await create();
    // TODO add all fields; double check the order of the arguments
    await executeSql(`INSERT INTO ${table_name} (id, has_data) VALUES (?, ?)`, [
      obj.id,
      obj.has_data,
    ]);
    console.log(`DB: successful ${funcName}`);
  } catch (e: any) {
    console.log(`DB: failed ${funcName}`, e);
    throw e;
  }
};

// const addCategory = async (obj: Category): Promise<void> => {
//   const funcName = `addCategory(${obj})`;
//   console.log(`DB: trying ${funcName}`);
//   try {
//     await create();
//     // TODO add all fields; double check the order of the arguments
//     await executeSql(
//       `INSERT INTO ${categories_table_name} (category, has_data) VALUES (?, ?)`,
//       [obj.category, obj.has_data],
//     );
//     console.log(`DB: successful ${funcName}`);
//   } catch (e: any) {
//     console.log(`DB: failed ${funcName}`, e);
//     throw e;
//   }
// };

const update = async (obj: Model): Promise<void> => {
  const funcName = `update(${obj})`;
  console.log(`DB: trying ${funcName}`);
  try {
    await create();
    // TODO update the fields; double check the order or the arguments
    await executeSql(`UPDATE ${table_name} SET has_data = ? WHERE id = ?`, [
      obj.has_data,
      obj.id,
    ]);
    console.log(`DB: successful ${funcName}`);
  } catch (e: any) {
    console.log(`DB: failed ${funcName}`, e);
    throw e;
  }
};

// const updateCategory = async (category: Category): Promise<void> => {
//   const funcName = `updateCategory(${category})`;
//   console.log(`DB: trying ${funcName}`);
//   try {
//     await create();
//     // TODO update the fields; double check the order or the arguments
//     await executeSql(
//       `UPDATE ${categories_table_name} SET has_data = ? WHERE category = ?`,
//       [category.has_data, category.category],
//     );
//     console.log(`DB: successful ${funcName}`);
//   } catch (e: any) {
//     console.log(`DB: failed ${funcName}`, e);
//     throw e;
//   }
// };

const remove = async (id: number) => {
  const funcName = `remove(${id})`;
  console.log(`DB: trying ${funcName}`);
  try {
    await create();
    await executeSql(`DELETE FROM ${table_name} WHERE id = ?`, [id]);
    console.log(`DB: successful ${funcName}`);
  } catch (e: any) {
    console.log(`DB: failed ${funcName}`, e);
    throw e;
  }
};

// const getNewTempId = async (): Promise<number> => {
//   await create();
//   const result = await executeSql(`SELECT MIN(id) AS minId FROM ${table_name}`);
//   const minId = result.rows.item(0).minId || 0;
//   console.log("Minimum ID:", minId);
//   return Math.min(minId, 0) - 1;
// };

// const updateIdAndSetStateOk = async (data: {
//   old_id: number;
//   new_id: number;
// }): Promise<void> => {
//   await create();
//   await executeSql(`UPDATE ${table_name} SET id = ?, state = ? WHERE id = ?`, [
//     data.new_id,
//     "ok",
//     data.old_id,
//   ]).catch(console.log);
//   const result = await executeSql(`SELECT * FROM ${table_name} WHERE id = ?`, [
//     data.new_id,
//   ]);
//   const result2 = await executeSql(`SELECT * FROM ${table_name} WHERE id = ?`, [
//     data.old_id,
//   ]);
//   return result.rows.item(0), result2.rows.item(0);
// };

export { add, doesTableExist, getAll, getById, remove, update };
