import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getByTeacherIdAndSemester(id, semester) {
  const response = await axios.get(`${apiUrl}/api/horario/${id}/${semester}`);

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

export async function deleteSchedule(teacher_id, semester, day, moment) {
  const response = await axios.delete(
    `${apiUrl}/api/horario/${teacher_id}/${semester}/${day}/${moment}`
  );

  return response;
}

export async function deleteAllSchedule(teacher_id, semester) {
  const response = await axios.delete(
    `${apiUrl}/api/horario/${teacher_id}/${semester}`
  );

  return response;
}
