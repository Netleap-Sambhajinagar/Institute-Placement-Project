import axios from "axios";

const client = axios.create({
  baseURL: "https://nits-b6hb.onrender.com/api",
  withCredentials: true,
});

export default client;
