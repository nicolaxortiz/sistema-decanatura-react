import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getByCredential(email, password) {
  const response = await axios.post(`${apiUrl}/api/coordinador/login`, {
    email,
    password,
  });

  return response;
}
