import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getAll() {
  const response = await axios.get(apiUrl + "/api/docentes/");

  return response;
}

export async function getByDocument(document) {
  const response = await axios.get(apiUrl + "/api/docentes/" + document);

  return response;
}

export async function getTeacherByCredentials(document, password) {
  const response = await axios.post(apiUrl + "/api/docentes/login", {
    documento: document,
    contrasena: password,
  });

  return response;
}

export async function getTeacherByEmailandDocument(correo, documento) {
  const response = await axios.post(apiUrl + "/api/docentes/recovery", {
    documento: documento,
    correo: correo,
  });

  return response;
}

export async function updateTeacher(id, teacher) {
  const response = await axios.put(apiUrl + "/api/docentes/" + id, teacher, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
}

export async function createOne(teacher) {
  const response = await axios.post(apiUrl + "/api/docentes/", teacher);

  return response;
}
