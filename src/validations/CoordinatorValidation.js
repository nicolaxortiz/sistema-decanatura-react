export const CoordinatorValidation = (form, fieldName, errors) => {
  let errorsData = errors;
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexEmail = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

  if (fieldName === "signature" || fieldName === "all") {
    if (form.signature === false) {
      errors.messages.signature = "El campo 'Firma' es requerido";
      errors.states.signature = true;
    } else {
      delete errors.messages.signature;
      delete errors.states.signature;
    }
  }

  if (fieldName === "document" || fieldName === "all") {
    if (!form.document) {
      errors.messages.document = "El campo 'Documento' es requerido";
      errors.states.document = true;
    } else {
      delete errors.messages.document;
      delete errors.states.document;
    }
  }

  if (fieldName === "last_name" || fieldName === "all") {
    if (!form.last_name) {
      errors.messages.last_name = "El campo 'Apellidos' es requerido";
      errors.states.last_name = true;
    } else if (!regexName.test(form.last_name.trim())) {
      errors.messages.last_name =
        "El campo 'Apellidos' sólo acepta letras y espacios en blanco";
      errors.states.last_name = true;
    } else {
      delete errors.messages.last_name;
      delete errors.states.last_name;
    }
  }

  if (fieldName === "first_name" || fieldName === "all") {
    if (!form.first_name) {
      errors.messages.first_name = "El campo 'Nombres' es requerido";
      errors.states.first_name = true;
    } else if (!regexName.test(form.first_name.trim())) {
      errors.messages.first_name =
        "El campo 'Nombres' sólo acepta letras y espacios en blanco";
      errors.states.first_name = true;
    } else {
      delete errors.messages.first_name;
      delete errors.states.first_name;
    }
  }

  if (fieldName === "email" || fieldName === "all") {
    if (!form.email) {
      errors.messages.email = "El campo 'Correo' es requerido";
      errors.states.email = true;
    } else if (!regexEmail.test(form.email.trim())) {
      errors.messages.email =
        "El campo 'Correo' no ha sido digitado correctamente";
      errors.states.email = true;
    } else {
      delete errors.messages.email;
      delete errors.states.email;
    }
  }

  return errors;
};
