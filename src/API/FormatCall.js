import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getByTeacherIdAndSemester(id, semester) {
  const response = await axios.get(`${apiUrl}/api/formato/${id}/${semester}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  });

  return response;
}

export async function getByProgramIdAndSemester(
  id,
  semester,
  searchName,
  actualPage,
  filter
) {
  const response = await axios.post(
    `${apiUrl}/api/formato/getAll`,
    {
      id,
      semester,
      searchName,
      actualPage,
      filter,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    }
  );

  return response;
}

export async function getSignedByProgramIdAndSemester(
  id,
  semester,
  searchName,
  actualPage,
  is_coord_signed,
  is_dean_signed
) {
  const response = await axios.post(
    `${apiUrl}/api/formato/getAllSigned`,
    {
      id,
      semester,
      searchName,
      actualPage,
      is_coord_signed,
      is_dean_signed,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    }
  );

  return response;
}

export async function postFormat(format) {
  const response = await axios.post(apiUrl + "/api/formato/", format, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  });

  return response;
}

export async function putSchedule(id, format) {
  const response = await axios.put(apiUrl + "/api/formato/" + id, format, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  });

  return response;
}
