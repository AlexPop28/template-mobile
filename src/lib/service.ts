import { Model, createModel } from "../model/model";
import useAxios from "./useAxios";

type setLoadingT = (newLoading: boolean) => void;

const safeRequest = <T>(
  setLoading: (newLoading: boolean) => void,
  request: () => Promise<T>,
): Promise<T> => {
  setLoading(true);
  return new Promise((resolve, reject) => {
    request()
      .then((result) => {
        setLoading(false);
        resolve(result);
      })
      .catch((error) => {
        setLoading(false);
        reject(error);
      });
  });
};

// TODO: remove other keys used only for the offline db
const removeOfflineKeys = (obj: Model) => {
  const { has_data: _, ...rest } = obj;
  return rest;
};
const getAll = async (setLoading: setLoadingT): Promise<Model[]> => {
  const axios = useAxios();
  console.log("SERVER: trying getAll");

  const request = async () => {
    try {
      const { data } = await axios.get("/");
      console.log("SERVER: getAll successful");
      return data.map(createModel);
    } catch (e: any) {
      console.log("SERVER ERROR: getAll failed:", e);
      throw e;
    }
  };

  return safeRequest(setLoading, request);
};

const getById = async (setLoading: setLoadingT, id: number): Promise<Model> => {
  console.log("SERVER: trying getById");
  const axios = useAxios();

  const request = async () => {
    try {
      const { data } = await axios.get(`/${id}/`);
      console.log("SERVER: getById successful");
      return createModel(data);
    } catch (e: any) {
      console.log("SERVER ERROR: getById failed:", e);
      throw e;
    }
  };

  return safeRequest(setLoading, request);
};

const add = async (setLoading: setLoadingT, obj_: Model): Promise<void> => {
  console.log("SERVER: trying add");
  const axios = useAxios();

  const request = async () => {
    const obj = removeOfflineKeys(obj_);
    try {
      await axios.post("/", JSON.stringify(obj));
      console.log("SERVER: add successful");
    } catch (e: any) {
      console.log("SERVER ERROR: add failed:", e);
      throw e;
    }
  };

  return safeRequest(setLoading, request);
};

const update = async (setLoading: setLoadingT, obj_: Model): Promise<void> => {
  console.log("SERVER: trying update");
  const axios = useAxios();

  const request = async () => {
    const obj = removeOfflineKeys(obj_);
    try {
      // TODO: check if not [patch] instead
      await axios.put(`/${obj.id}/`, JSON.stringify(obj));
      console.log("SERVER: update successful");
    } catch (e: any) {
      console.log("SERVER ERROR: update failed:", e);
      throw e;
    }
  };

  return safeRequest(setLoading, request);
};

const remove = async (setLoading: setLoadingT, id: number): Promise<void> => {
  console.log("SERVER: trying remove");
  const axios = useAxios();

  const request = async () => {
    try {
      await axios.delete(`/${id}/`);
      console.log("SERVER: remove successful");
    } catch (e: any) {
      console.log("SERVER ERROR: remove failed:", e);
      throw e;
    }
  };

  return safeRequest(setLoading, request);
};

export { add, getAll, getById, remove, update };
