import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getDocument(semester, id) {
  const response = await axios.get(
    `${apiUrl}/api/documento/pdf/${semester}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
      responseType: "blob",
    }
  );

  return response;
}

export async function getReporte(program_id, semester, title) {
  const response = await axios.get(
    `${apiUrl}/api/documento/pdfFinal/${program_id}/${semester}/${title}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
      responseType: "blob",
    }
  );

  return response;
}

export async function getReporteByMission(
  program_id,
  semester,
  mission,
  title
) {
  const response = await axios.get(
    `${apiUrl}/api/documento/pdfMission/${program_id}/${semester}/${mission}/${title}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
      responseType: "blob",
    }
  );

  return response;
}
