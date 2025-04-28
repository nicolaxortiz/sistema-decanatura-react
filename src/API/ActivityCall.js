import React from "react";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

// export async function getAll() {
//   const response = await axios.get(apiUrl + "/api/actividad/");

//   return response;
// }

export async function saveActivitys(activity) {
  const response = await axios.post(apiUrl + "/api/actividad/save", activity, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  });

  return response;
}

export async function getbyIdDocenteAndSemester(id, semester) {
  const response = await axios.get(
    `${apiUrl}/api/actividad/getByIdAndSemester/${id}/${semester}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    }
  );

  return response;
}

export async function updateActivity(id, activity) {
  const response = await axios.put(apiUrl + "/api/actividad/" + id, activity, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  });

  return response;
}

export async function deleteActivity(id) {
  const response = await axios.delete(apiUrl + "/api/actividad/" + id, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  });

  return response;
}
