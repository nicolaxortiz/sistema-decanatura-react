import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getDocument(id) {
  const response = await axios.get(apiUrl + "/api/documento/pdf/" + id);

  return response;
}

export async function getReporte() {
  const response = await axios.get(apiUrl + "/api/documento/pdfFinal");

  return response;
}
