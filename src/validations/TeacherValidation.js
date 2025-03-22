export const TeacherValidation = (form, fieldName, errors) => {
  let errorsData = errors;
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexNumber = /^\d{10}$/;
  let regexEmail = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

  if (fieldName === "photo" || fieldName === "all") {
    if (form.photo === false) {
      errors.messages.photo = "El campo 'Foto' es requerido";
      errors.states.photo = true;
    } else {
      delete errors.messages.photo;
      delete errors.states.photo;
    }
  }

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

  if (fieldName === "card" || fieldName === "all") {
    if (!form.card) {
      errors.messages.card = "El campo 'Tarjeta' es requerido";
      errors.states.card = true;
    } else {
      delete errors.messages.card;
      delete errors.states.card;
    }
  }

  if (fieldName === "faculty" || fieldName === "all") {
    if (!form.faculty) {
      errors.messages.faculty = "El campo 'Facultad' es requerido";
      errors.states.faculty = true;
    } else {
      delete errors.messages.faculty;
      delete errors.states.faculty;
    }
  }

  if (fieldName === "employment_type" || fieldName === "all") {
    if (!form.employment_type) {
      errors.messages.employment_type =
        "El campo 'Tipo de vinculación' es requerido";
      errors.states.employment_type = true;
    } else {
      delete errors.messages.employment_type;
      delete errors.states.employment_type;
    }
  }

  if (fieldName === "rank" || fieldName === "all") {
    if (!form.rank) {
      errors.messages.rank = "El campo 'Escalafón' es requerido";
      errors.states.rank = true;
    } else {
      delete errors.messages.rank;
      delete errors.states.rank;
    }
  }

  if (fieldName === "address" || fieldName === "all") {
    if (!form.address) {
      errors.messages.address = "El campo 'Dirección' es requerido";
      errors.states.address = true;
    } else {
      delete errors.messages.address;
      delete errors.states.address;
    }
  }

  if (fieldName === "phone" || fieldName === "all") {
    if (!form.phone) {
      errors.messages.phone = "El campo 'Celular' es requerido";
      errors.states.phone = true;
    } else if (!regexNumber.test(form.phone)) {
      errors.messages.phone = "El campo 'Celular' sólo acepta 10 dígitos";
      errors.states.phone = true;
    } else {
      delete errors.messages.phone;
      delete errors.states.phone;
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

  if (fieldName === "undergraduate" || fieldName === "all") {
    if (!form.undergraduate) {
      errors.messages.undergraduate = "El campo 'Pregrado' es requerido";
      errors.states.undergraduate = true;
    } else if (!regexName.test(form.undergraduate.trim())) {
      errors.messages.undergraduate =
        "El campo 'Pregrado' sólo acepta letras y espacios en blanco";
      errors.states.undergraduate = true;
    } else {
      delete errors.messages.undergraduate;
      delete errors.states.undergraduate;
    }
  }

  if (fieldName === "specialization" || fieldName === "all") {
    if (!!form.specialization && !regexName.test(form.specialization)) {
      errors.messages.specialization =
        "El campo 'Especialización' sólo acepta letras y espacios en blanco";
      errors.states.specialization = true;
    } else {
      delete errors.messages.specialization;
      delete errors.states.specialization;
    }
  }

  if (fieldName === "master" || fieldName === "all") {
    if (!!form.master && !regexName.test(form.master.trim())) {
      errors.messages.master =
        "El campo 'Magister' sólo acepta letras y espacios en blanco";
      errors.states.master = true;
    } else {
      delete errors.messages.master;
      delete errors.states.master;
    }
  }

  if (fieldName === "doctorate" || fieldName === "all") {
    if (!!form.doctorate && !regexName.test(form.doctorate.trim())) {
      errors.messages.doctorate =
        "El campo 'Doctorado' sólo acepta letras y espacios en blanco";
      errors.states.doctorate = true;
    } else {
      delete errors.messages.doctorate;
      delete errors.states.doctorate;
    }
  }

  return errors;
};
