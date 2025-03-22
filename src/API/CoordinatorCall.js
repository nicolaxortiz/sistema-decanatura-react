import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getByCredential(email, password) {
  const response = await axios.post(`${apiUrl}/api/coordinador/login`, {
    email,
    password,
  });

  return response;
}

export async function getByCampusId(campus_id) {
  const response = await axios.get(`${apiUrl}/api/coordinador/${campus_id}`);

  return response;
}

export async function postCoordinator(coordinator) {
  const response = await axios.post(apiUrl + "/api/coordinador", coordinator, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
}

export async function updateCoordinator(id, coordinator) {
  const response = await axios.put(
    apiUrl + "/api/coordinador/" + id,
    coordinator,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
}
