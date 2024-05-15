import React from "react";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const semester = process.env.REACT_APP_CURRENT_SEMESTER;

export async function getAll() {
  const response = await axios.get(apiUrl + "/api/actividad/");

  return response;
}

export async function saveActivitys(activity) {
  const response = await axios.post(apiUrl + "/api/actividad/save", {
    idDocente: activity.idDocente,
    actividad: activity.actividad,
    semestre: semester,
  });

  return response;
}

export async function getbyIdDocenteAndSemester(id) {
  const response = await axios.get(apiUrl + "/api/actividad/" + id);

  return response;
}

export async function updateActivity(id, activity) {
  const response = await axios.put(apiUrl + "/api/actividad/" + id, activity);

  return response;
}
