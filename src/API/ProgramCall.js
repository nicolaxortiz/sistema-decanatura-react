import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getByCampusId(campus_id, actualPage) {
  const response = await axios.get(
    `${apiUrl}/api/programa/getByCampusId/${campus_id}/${actualPage}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    }
  );

  return response;
}

export async function getAllByCampusId(campus_id) {
  const response = await axios.get(
    `${apiUrl}/api/programa/getAllByCampusId/${campus_id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    }
  );

  return response;
}

export async function postProgram(program) {
  const response = await axios.post(`${apiUrl}/api/programa/`, program, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  });

  return response;
}

export async function updateProgram(id, program) {
  const response = await axios.put(`${apiUrl}/api/programa/${id}`, program, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  });

  return response;
}
