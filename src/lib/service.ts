import { Model, createModel } from "../model/model";
import useAxios from "./useAxios";

type setIsLoadingT = (newLoading: boolean) => void;

const safeRequest = <T>(
  setIsLoading: (newLoading: boolean) => void,
  request: () => Promise<T>,
): Promise<T> => {
  setIsLoading(true);
  return new Promise((resolve, reject) => {
    request()
      .then((result) => {
        setIsLoading(false);
        resolve(result);
      })
      .catch((error) => {
        setIsLoading(false);
        reject(error);
      });
  });
};

// TODO: remove other keys used only for the offline db
const removeOfflineKeys = (obj: Model) => {
  const { has_data: _, ...rest } = obj;
  return rest;
};
const getAll = async (setIsLoading: setIsLoadingT): Promise<Model[]> => {
  const axios = useAxios();
  console.log("SERVER: trying getAll");

  const request = async () => {
    try {
      const { data } = await axios.get("/pets");
      console.log("SERVER: getAll successful");
      return data.map(createModel);
    } catch (e: any) {
      console.log(
        "SERVER ERROR: getAll failed:",
        e.message,
        e.response,
        e.request,
      );
      throw e;
    }
  };

  return safeRequest(setIsLoading, request);
};

const getById = async (
  setIsLoading: setIsLoadingT,
  id: number,
): Promise<Model> => {
  console.log("SERVER: trying getById");
  const axios = useAxios();

  const request = async () => {
    try {
      const { data } = await axios.get(`/pet/${id}/`);
      console.log("SERVER: getById successful");
      return createModel(data);
    } catch (e: any) {
      console.log("SERVER ERROR: getById failed:", e.toString());
      throw e;
    }
  };

  return safeRequest(setIsLoading, request);
};

const add = async (setIsLoading: setIsLoadingT, obj_: Model): Promise<void> => {
  console.log("SERVER: trying add");
  const axios = useAxios();

  const request = async () => {
    const obj = removeOfflineKeys(obj_);
    try {
      await axios.post("/pets", JSON.stringify(obj));
      console.log("SERVER: add successful");
    } catch (e: any) {
      console.log("SERVER ERROR: add failed:", e.toString());
      throw e;
    }
  };

  return safeRequest(setIsLoading, request);
};

const update = async (
  setIsLoading: setIsLoadingT,
  obj_: Model,
): Promise<void> => {
  console.log("SERVER: trying update");
  const axios = useAxios();

  const request = async () => {
    const obj = removeOfflineKeys(obj_);
    try {
      // TODO: check if not [patch] instead
      await axios.put(`/pet/${obj.id}/`, JSON.stringify(obj));
      console.log("SERVER: update successful");
    } catch (e: any) {
      console.log("SERVER ERROR: update failed:", e.toString());
      throw e;
    }
  };

  return safeRequest(setIsLoading, request);
};

const remove = async (
  setIsLoading: setIsLoadingT,
  id: number,
): Promise<void> => {
  console.log("SERVER: trying remove");
  const axios = useAxios();

  const request = async () => {
    try {
      await axios.delete(`/pet/${id}/`);
      console.log("SERVER: remove successful");
    } catch (e: any) {
      console.log("SERVER ERROR: remove failed:", e.toString());
      throw e;
    }
  };

  return safeRequest(setIsLoading, request);
};

export { add, getAll, getById, remove, update };
