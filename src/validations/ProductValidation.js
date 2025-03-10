export const ProductValidation = (form, fieldName, errors) => {
  let errorsData = errors;
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexNumber = /^(0|[1-9]\d?)(?:\.\d{1,2})?$/;

  if (fieldName === "estimated_date" || fieldName === "all") {
    if (form.product.estimated_date === null) {
      errors.messages.estimated_date = "El campo 'Fecha Estimada' es requerido";
      errors.states.estimated_date = true;
    } else {
      delete errors.messages.estimated_date;
      delete errors.states.estimated_date;
    }
  }

  return errors;
};
