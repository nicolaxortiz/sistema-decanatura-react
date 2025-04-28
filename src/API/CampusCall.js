import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getByCredential(email, password) {
  const response = await axios.post(`${apiUrl}/api/campus/login`, {
    email,
    password,
  });

  return response;
}

export async function getCampusByEmail(email) {
  const response = await axios.post(apiUrl + "/api/campus/recovery", {
    email,
  });

  return response;
}

export async function updateCampus(id, campus) {
  const response = await axios.put(apiUrl + "/api/campus/" + id, campus, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  });

  return response;
}
