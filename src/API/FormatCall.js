import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getByTeacherIdAndSemester(id, semester) {
  const response = await axios.get(`${apiUrl}/api/formato/${id}/${semester}`);

  return response;
}

export async function getByProgramIdAndSemester(id, semester, actualPage) {
  const response = await axios.get(
    `${apiUrl}/api/formato/getAll/${id}/${semester}/${actualPage}`
  );

  return response;
}

export async function postFormat(format) {
  const response = await axios.post(apiUrl + "/api/formato/", format);

  return response;
}

export async function putSchedule(id, format) {
  const response = await axios.put(apiUrl + "/api/formato/" + id, format);

  return response;
}
