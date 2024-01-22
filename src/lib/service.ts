import { Model, createModel } from "../model/model";
import useAxios from "./useAxios";

// TODO: remove other keys used only for the offline db
const removeOfflineKeys = (obj: Model) => {
  const { has_data: _, ...rest } = obj;
  return rest;
};
const getAll = async (): Promise<Model[]> => {
  const axios = useAxios();

  try {
    const { data } = await axios.get("/");
    return data.map(createModel);
  } catch (e: any) {
    console.log("SERVER ERROR: getAll failed:", e);
    throw e;
  }
};

const getById = async (id: number): Promise<Model> => {
  const axios = useAxios();

  try {
    const { data } = await axios.get(`/${id}/`);
    return createModel(data);
  } catch (e: any) {
    console.log("SERVER ERROR: getById failed:", e);
    throw e;
  }
};

const add = async (obj_: Model): Promise<void> => {
  const axios = useAxios();
  const obj = removeOfflineKeys(obj_);
  try {
    await axios.post("/", JSON.stringify(obj));
  } catch (e: any) {
    console.log("SERVER ERROR: add failed:", e);
    throw e;
  }
};

const update = async (obj_: Model): Promise<void> => {
  const axios = useAxios();
  const obj = removeOfflineKeys(obj_);
  try {
    // TODO: check if not [patch] instead
    await axios.put(`/${obj.id}/`, JSON.stringify(obj));
  } catch (e: any) {
    console.log("SERVER ERROR: update failed:", e);
    throw e;
  }
};

const remove = async (id: number): Promise<void> => {
  const axios = useAxios();
  try {
    await axios.delete(`/${id}/`);
  } catch (e: any) {
    console.log("SERVER ERROR: remove failed:", e);
    throw e;
  }
};

export { add, getAll, getById, remove, update };
