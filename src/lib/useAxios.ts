import axios from "axios";

export default function useAxios() {
  // TODO change the url
  return axios.create({ baseURL: "127.0.0.1:3000" });
}
