import axios from "axios";

const client = axios.create({
  baseURL: "https://institute-placement-project-n60r.onrender.com/api",
  withCredentials: true,
});

export default client;
