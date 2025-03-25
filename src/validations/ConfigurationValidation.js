export const ConfigurationValidation = (form, fieldName, errors) => {
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

  if (fieldName === "docencia" || fieldName === "all") {
    if (!form.docencia) {
      errors.messages.docencia = "El campo 'Docencia' es requerido";
      errors.states.docencia = true;
    } else {
      delete errors.messages.docencia;
      delete errors.states.docencia;
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

  if (fieldName === "comites" || fieldName === "all") {
    if (!form.comites) {
      errors.messages.comites = "El campo 'Comités' es requerido";
      errors.states.comites = true;
    } else {
      delete errors.messages.comites;
      delete errors.states.comites;
    }
  }

  if (fieldName === "otras" || fieldName === "all") {
    if (!form.otras) {
      errors.messages.otras = "El campo 'Otras' es requerido";
      errors.states.otras = true;
    } else {
      delete errors.messages.otras;
      delete errors.states.otras;
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
