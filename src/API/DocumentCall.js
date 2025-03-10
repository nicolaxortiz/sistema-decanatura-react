import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getDocument(semester, id) {
  const response = await axios.get(
    `${apiUrl}/api/documento/pdf/${semester}/${id}`
  );

  return response;
}

export async function getReporte(program_id, semester) {
  const response = await axios.get(
    `${apiUrl}/api/documento/pdfFinal/${program_id}/${semester}`
  );

  return response;
}
