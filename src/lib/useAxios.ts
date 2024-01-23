import axios from "axios";

export default function useAxios() {
  // TODO change the url
  return axios.create({ baseURL: "http://192.168.0.186:2309/" });
}
