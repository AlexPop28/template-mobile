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
  const funcName = `getAll(${category_name})`;
  console.log(`SERVER: trying ${funcName}`);

  const request = async () => {
    try {
      const { data } = await axios.get("/pets");
      console.log(`SERVER: ${funcName} successful`);
      return data.map(createModel);
    } catch (e: any) {
      console.log(
        `SERVER ERROR: ${funcName} failed; `,
        e.message,
        e.response,
        e.request,
      );
      throw e;
    }
  };

  return safeRequest(setIsLoading, request);
};

// const getAllCategories = async (
//   setIsLoading: setIsLoadingT,
// ): Promise<Category[]> => {
//   const axios = useAxios();
//   const funcName = `getAllCategories`;
//   console.log(`SERVER: trying ${funcName}`);

//   const request = async () => {
//     try {
//       const { data } = await axios.get("/categories");

//       const result = data.map((category: string) => {
//         return { category, has_data: 0 };
//       });
//       console.log(`SERVER: ${funcName} successful`);
//       return result;
//     } catch (e: any) {
//       console.log(
//         `SERVER ERROR: ${funcName} failed; `,
//         e.message,
//         e.response,
//         e.request,
//       );
//       throw e;
//     }
//   };

//   return safeRequest(setIsLoading, request);
// };

const getById = async (
  setIsLoading: setIsLoadingT,
  id: number,
): Promise<Model> => {
  const funcName = `getById(${id})`;
  console.log(`SERVER: trying ${funcName}`);
  const axios = useAxios();

  const request = async () => {
    try {
      const { data } = await axios.get(`/pet/${id}/`);
      console.log(`SERVER: ${funcName} successful`);
      return createModel(data);
    } catch (e: any) {
      console.log(
        `SERVER ERROR: ${funcName} failed; `,
        e.message,
        e.response,
        e.request,
      );
      throw e;
    }
  };

  return safeRequest(setIsLoading, request);
};

const add = async (setIsLoading: setIsLoadingT, obj_: Model): Promise<void> => {
  const axios = useAxios();

  const request = async () => {
    const { id: _, ...obj } = removeOfflineKeys(obj_);
    const funcName = `add(${obj})`;
    console.log(`SERVER: trying ${funcName}`);
    try {
      await axios.post("/pets", JSON.stringify(obj));
      console.log(`SERVER: ${funcName} successful`);
    } catch (e: any) {
      console.log(
        `SERVER ERROR: ${funcName} failed; `,
        e.message,
        e.response,
        e.request,
      );
      throw e;
    }
  };

  return safeRequest(setIsLoading, request);
};

const update = async (
  setIsLoading: setIsLoadingT,
  obj_: Model,
): Promise<void> => {
  const axios = useAxios();

  const request = async () => {
    const obj = removeOfflineKeys(obj_);
    const funcName = `update(${obj})`;
    console.log(`SERVER: trying ${funcName}`);
    try {
      // TODO: check if not [patch] instead
      await axios.put(`/pet/${obj.id}/`, JSON.stringify(obj));
      console.log(`SERVER: ${funcName} successful`);
    } catch (e: any) {
      console.log(
        `SERVER ERROR: ${funcName} failed; `,
        e.message,
        e.response,
        e.request,
      );
      throw e;
    }
  };

  return safeRequest(setIsLoading, request);
};

const remove = async (
  setIsLoading: setIsLoadingT,
  id: number,
): Promise<void> => {
  const funcName = `remove(${id})`;
  console.log(`SERVER: trying ${funcName}`);
  const axios = useAxios();

  const request = async () => {
    try {
      await axios.delete(`/pet/${id}/`);
      console.log(`SERVER: ${funcName} successful`);
    } catch (e: any) {
      console.log(
        `SERVER ERROR: ${funcName} failed; `,
        e.message,
        e.response,
        e.request,
      );
      throw e;
    }
  };

  return safeRequest(setIsLoading, request);
};

const search = async (setIsLoading: setIsLoadingT): Promise<Model[]> => {
  const funcName = `search`;
  console.log(`SERVER: trying ${funcName}`);
  const axios = useAxios();

  const request = async () => {
    try {
      const { data } = await axios.get("/search");
      console.log(`SERVER: ${funcName} successful`);
      return data.map(createModel);
    } catch (e: any) {
      console.log(
        `SERVER ERROR: ${funcName} failed; `,
        e.message,
        e.response,
        e.request,
      );
      throw e;
    }
  };

  return safeRequest(setIsLoading, request);
};

export { add, getAll, getById, remove, search, update };
