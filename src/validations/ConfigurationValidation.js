export const ConfigurationValidation = (form, fieldName, errors) => {
  let errorsData = errors;
  let regexNumber = /^(?!0(\.0{1,3})?$)\d+(\.\d{1,3})?$/;

  if (fieldName === "semester" || fieldName === "all") {
    if (!form.semester) {
      errors.messages.semester = "El campo 'Semestre' es requerido";
      errors.states.semester = true;
    } else {
      delete errors.messages.semester;
      delete errors.states.semester;
    }
  }

  if (fieldName === "start_date" || fieldName === "all") {
    if (form.start_date === null) {
      errors.messages.start_date = "El campo 'Inicio de semestre' es requerido";
      errors.states.start_date = true;
    } else {
      delete errors.messages.start_date;
      delete errors.states.start_date;
    }
  }

  if (fieldName === "end_date" || fieldName === "all") {
    if (form.end_date === null) {
      errors.messages.end_date = "El campo 'Fin de semestre' es requerido";
      errors.states.end_date = true;
    } else {
      delete errors.messages.end_date;
      delete errors.states.end_date;
    }
  }

  if (fieldName === "tc_hours" || fieldName === "all") {
    if (!form.tc_hours) {
      errors.messages.tc_hours = "El campo 'Horas' es requerido";
      errors.states.tc_hours = true;
    } else if (!regexNumber.test(form.tc_hours)) {
      errors.messages.tc_hours =
        "El campo 'Horas' solo acepta números mayores a 0 y números decimales de dos cifras";
      errors.states.tc_hours = true;
    } else {
      delete errors.messages.tc_hours;
      delete errors.states.tc_hours;
    }
  }

  if (fieldName === "mt_hours" || fieldName === "all") {
    if (!form.mt_hours) {
      errors.messages.mt_hours = "El campo 'Horas' es requerido";
      errors.states.mt_hours = true;
    } else if (!regexNumber.test(form.mt_hours)) {
      errors.messages.mt_hours =
        "El campo 'Horas' solo acepta números mayores a 0 y números decimales de dos cifras";
      errors.states.mt_hours = true;
    } else {
      delete errors.messages.mt_hours;
      delete errors.states.mt_hours;
    }
  }

  if (fieldName === "investigacion" || fieldName === "all") {
    if (!form.investigacion) {
      errors.messages.investigacion = "El campo 'Investigación' es requerido";
      errors.states.investigacion = true;
    } else {
      delete errors.messages.investigacion;
      delete errors.states.investigacion;
    }
  }

  if (fieldName === "extension" || fieldName === "all") {
    if (!form.extension) {
      errors.messages.extension = "El campo 'Extensión' es requerido";
      errors.states.extension = true;
    } else {
      delete errors.messages.extension;
      delete errors.states.extension;
    }
  }

  if (fieldName === "oaca" || fieldName === "all") {
    if (!form.oaca) {
      errors.messages.oaca = "El campo 'OACA' es requerido";
      errors.states.oaca = true;
    } else {
      delete errors.messages.oaca;
      delete errors.states.oaca;
    }
  }

  if (fieldName === "oda" || fieldName === "all") {
    if (!form.oda) {
      errors.messages.oda = "El campo 'ODA' es requerido";
      errors.states.oda = true;
    } else {
      delete errors.messages.oda;
      delete errors.states.oda;
    }
  }

  if (fieldName === "title" || fieldName === "all") {
    if (!form.title) {
      errors.messages.title = "El campo 'Titulo del formato' es requerido";
      errors.states.title = true;
    } else {
      delete errors.messages.title;
      delete errors.states.title;
    }
  }

  return errors;
};
