import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getAll(program_id, filter, name, page) {
  const response = await axios.post(
    `${apiUrl}/api/docentes/sort`,
    {
      program_id,
      filter,
      name,
      page,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    }
  );

  return response;
}

export async function getByDocument(program_id, document) {
  const response = await axios.get(
    `${apiUrl}/api/docentes/${program_id}/${document}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    }
  );

  return response;
}

export async function getTeacherByCredentials(email, password) {
  const response = await axios.post(apiUrl + "/api/docentes/login", {
    email,
    password,
  });

  return response;
}

export async function getTeacherByEmail(email) {
  const response = await axios.post(apiUrl + "/api/docentes/recovery", {
    email,
  });

  return response;
}

export async function updateTeacher(id, teacher) {
  const response = await axios.put(apiUrl + "/api/docentes/" + id, teacher, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  });

  return response;
}

export async function postTeacher(teacher) {
  const response = await axios.post(apiUrl + "/api/docentes/", teacher, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
  });

  return response;
}

export async function updateState(id, is_active) {
  const response = await axios.put(
    apiUrl + "/api/docentes/state" + id,
    {
      is_active,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    }
  );

  return response;
}
