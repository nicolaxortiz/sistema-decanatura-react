export const ActivityValidation = (form, fieldName, errors) => {
  let errorsData = errors;
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexNumber = /^(0*(?:[1-9]|1[0-5])(?:\.\d+)?)$/;

  if (fieldName === "nombre" || fieldName === "all") {
    if (!form.nombre.trim()) {
      errors.messages.nombre = "El campo 'Nombre' es requerido";
      errors.states.nombre = true;
    } else {
      delete errors.messages.nombre;
      delete errors.states.nombre;
    }
  }

  if (fieldName === "descripcion" || fieldName === "all") {
    if (!form.descripcion.trim()) {
      errors.messages.descripcion = "El campo 'Descripcion' es requerido";
      errors.states.descripcion = true;
    } else {
      delete errors.messages.descripcion;
      delete errors.states.descripcion;
    }
  }

  if (fieldName === "horas" || fieldName === "all") {
    if (!form.horas) {
      errors.messages.horas = "El campo 'Horas' es requerido";
      errors.states.horas = true;
    } else if (!regexNumber.test(form.horas)) {
      errors.messages.horas =
        "El campo 'Horas' solo acepta numeros del 1 al 10 y numeros decimales de dos cifras";
      errors.states.horas = true;
    } else {
      delete errors.messages.horas;
      delete errors.states.horas;
    }
  }

  if (fieldName === "responsable" || fieldName === "all") {
    if (!form.responsable.trim()) {
      errors.messages.responsable = "El campo 'Responsable' es requerido";
      errors.states.responsable = true;
    } else if (!regexName.test(form.responsable)) {
      errors.messages.responsable =
        "El campo 'Responsable' solo acepta letras y espacios";
      errors.states.responsable = true;
    } else {
      delete errors.messages.responsable;
      delete errors.states.responsable;
    }
  }

  return errors;
};
