export const ProductValidation = (form, fieldName, errors) => {
  let errorsData = errors;
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexNumber = /^(0|[1-9]\d?)(?:\.\d{1,2})?$/;

  if (fieldName === "fechaEstimada" || fieldName === "all") {
    if (form.fechaEstimada === null) {
      errors.messages.fechaEstimada = "El campo 'Fecha Estimada' es requerido";
      errors.states.fechaEstimada = true;
    } else {
      delete errors.messages.fechaEstimada;
      delete errors.states.fechaEstimada;
    }
  }

  return errors;
};
