import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getByCredential(email, password) {
  const response = await axios.post(`${apiUrl}/api/decano/login`, {
    email,
    password,
  });

  return response;
}

export async function getDeanByEmail(email) {
  const response = await axios.post(apiUrl + "/api/decano/recovery", {
    email,
  });

  return response;
}

export async function getByCampusId(campus_id, actualPage) {
  const response = await axios.get(
    `${apiUrl}/api/decano/${campus_id}/${actualPage}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    }
  );

  return response;
}

export async function postDean(dean) {
  const response = await axios.post(apiUrl + "/api/decano", dean, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  });

  return response;
}

export async function updateDean(id, dean) {
  const response = await axios.put(apiUrl + "/api/decano/" + id, dean, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  });

  return response;
}
