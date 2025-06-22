export const ActivityValidation = (form, fieldName, errors) => {
  let errorsData = errors;
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexNumber = /^(?:[1-9]|[1-3][0-9]|40)(?:\.\d+)?$/;

  if (fieldName === "name" || fieldName === "all") {
    if (!form.name.trim()) {
      errors.messages.name = "El campo 'Nombre' es requerido";
      errors.states.name = true;
    } else {
      delete errors.messages.name;
      delete errors.states.name;
    }
  }

  if (fieldName === "description" || fieldName === "all") {
    if (!form.description.trim()) {
      errors.messages.description = "El campo 'Descripción' es requerido";
      errors.states.description = true;
    } else {
      delete errors.messages.description;
      delete errors.states.description;
    }
  }

  if (fieldName === "hours" || fieldName === "all") {
    if (!form.hours) {
      errors.messages.hours = "El campo 'Horas' es requerido";
      errors.states.hours = true;
    } else if (!regexNumber.test(form.hours)) {
      errors.messages.hours =
        "El campo 'Horas' solo acepta números del 1 al 40 y números decimales de dos cifras";
      errors.states.hours = true;
    } else {
      delete errors.messages.hours;
      delete errors.states.hours;
    }
  }

  if (fieldName === "responsible" || fieldName === "all") {
    if (!form.responsible.trim()) {
      errors.messages.responsible = "El campo 'Responsable' es requerido";
      errors.states.responsible = true;
    } else if (!regexName.test(form.responsible)) {
      errors.messages.responsible =
        "El campo 'Responsable' solo acepta letras y espacios";
      errors.states.responsible = true;
    } else {
      delete errors.messages.responsible;
      delete errors.states.responsible;
    }
  }

  return errors;
};
