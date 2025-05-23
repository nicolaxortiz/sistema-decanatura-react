import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const createConfiguration = async (configuration) => {
  const response = await axios.post(
    `${apiUrl}/api/configuracion/`,
    configuration,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    }
  );

  return response;
};

export const getByIdProgram = async (program_id) => {
  const response = await axios.get(
    `${apiUrl}/api/configuracion/getByProgramId/${program_id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    }
  );

  return response;
};

export const getByIdCampus = async (campus_id) => {
  const response = await axios.get(
    `${apiUrl}/api/configuracion/getByCampusId/${campus_id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    }
  );

  return response;
};
