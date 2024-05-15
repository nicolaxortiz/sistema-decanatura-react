import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getByIdActivity(id) {
  const response = await axios.get(apiUrl + "/api/horario/" + id);

  return response;
}

export async function postSchedule(schedule) {
  const response = await axios.post(apiUrl + "/api/horario/save", schedule);

  return response;
}

export async function putSchedule(id, schedule) {
  const response = await axios.put(apiUrl + "/api/horario/" + id, schedule);

  return response;
}
