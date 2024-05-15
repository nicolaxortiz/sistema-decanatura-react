export const TeacherValidation = (form, fieldName, errors) => {
  let errorsData = errors;
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  let regexNumber = /^\d{10}$/;
  let regexEmail = /@correo\.uts\.edu\.co$/;

  if (fieldName === "foto" || fieldName === "all") {
    if (!form.foto) {
      errors.messages.foto = "El campo 'Foto' es requerido";
      errors.states.foto = true;
    } else {
      delete errors.messages.foto;
      delete errors.states.foto;
    }
  }

  if (fieldName === "firma" || fieldName === "all") {
    if (!form.firma) {
      errors.messages.firma = "El campo 'Firma' es requerido";
      errors.states.firma = true;
    } else {
      delete errors.messages.firma;
      delete errors.states.firma;
    }
  }

  if (fieldName === "documento" || fieldName === "all") {
    if (!form.documento) {
      errors.messages.documento = "El campo 'Documento' es requerido";
      errors.states.documento = true;
    } else {
      delete errors.messages.documento;
      delete errors.states.documento;
    }
  }

  if (fieldName === "apellidos" || fieldName === "all") {
    if (!form.apellidos) {
      errors.messages.apellidos = "El campo 'Apellidos' es requerido";
      errors.states.apellidos = true;
    } else if (!regexName.test(form.apellidos.trim())) {
      errors.messages.apellidos =
        "El campo 'Apellidos' sólo acepta letras y espacios en blanco";
      errors.states.apellidos = true;
    } else {
      delete errors.messages.apellidos;
      delete errors.states.apellidos;
    }
  }

  if (fieldName === "nombres" || fieldName === "all") {
    if (!form.nombres) {
      errors.messages.nombres = "El campo 'Nombres' es requerido";
      errors.states.nombres = true;
    } else if (!regexName.test(form.nombres.trim())) {
      errors.messages.nombres =
        "El campo 'Nombres' sólo acepta letras y espacios en blanco";
      errors.states.nombres = true;
    } else {
      delete errors.messages.nombres;
      delete errors.states.nombres;
    }
  }

  if (fieldName === "tarjeta" || fieldName === "all") {
    if (!form.tarjeta) {
      errors.messages.tarjeta = "El campo 'Tarjeta' es requerido";
      errors.states.tarjeta = true;
    } else {
      delete errors.messages.tarjeta;
      delete errors.states.tarjeta;
    }
  }

  if (fieldName === "facultad" || fieldName === "all") {
    if (!form.facultad) {
      errors.messages.facultad = "El campo 'Facultad' es requerido";
      errors.states.facultad = true;
    } else {
      delete errors.messages.facultad;
      delete errors.states.facultad;
    }
  }

  if (fieldName === "unidadAcademica" || fieldName === "all") {
    if (!form.unidadAcademica) {
      errors.messages.unidadAcademica =
        "El campo 'Unidad academica' es requerido";
      errors.states.unidadAcademica = true;
    } else {
      delete errors.messages.unidadAcademica;
      delete errors.states.unidadAcademica;
    }
  }

  if (fieldName === "campus" || fieldName === "all") {
    if (!form.campus) {
      errors.messages.campus = "El campo 'Campus' es requerido";
      errors.states.campus = true;
    } else {
      delete errors.messages.campus;
      delete errors.states.campus;
    }
  }

  if (fieldName === "vinculacion" || fieldName === "all") {
    if (!form.vinculacion) {
      errors.messages.vinculacion =
        "El campo 'Tipo de vinculacion' es requerido";
      errors.states.vinculacion = true;
    } else {
      delete errors.messages.vinculacion;
      delete errors.states.vinculacion;
    }
  }

  if (fieldName === "escalafon" || fieldName === "all") {
    if (!form.escalafon) {
      errors.messages.escalafon = "El campo 'Escalafon' es requerido";
      errors.states.escalafon = true;
    } else {
      delete errors.messages.escalafon;
      delete errors.states.escalafon;
    }
  }

  if (fieldName === "direccion" || fieldName === "all") {
    if (!form.direccion) {
      errors.messages.direccion = "El campo 'Direccion' es requerido";
      errors.states.direccion = true;
    } else {
      delete errors.messages.direccion;
      delete errors.states.direccion;
    }
  }

  if (fieldName === "celular" || fieldName === "all") {
    if (!form.celular) {
      errors.messages.celular = "El campo 'Celular' es requerido";
      errors.states.celular = true;
    } else if (!regexNumber.test(form.celular)) {
      errors.messages.celular = "El campo 'Celular' sólo acepta 10 digitos";
      errors.states.celular = true;
    } else {
      delete errors.messages.celular;
      delete errors.states.celular;
    }
  }

  if (fieldName === "correo" || fieldName === "all") {
    if (!form.correo) {
      errors.messages.correo = "El campo 'Correo' es requerido";
      errors.states.correo = true;
    } else if (!regexEmail.test(form.correo.trim())) {
      errors.messages.correo =
        "El campo 'Correo' debe pertenecer al dominio @correo.uts.edu.co";
      errors.states.correo = true;
    } else {
      delete errors.messages.correo;
      delete errors.states.correo;
    }
  }

  if (fieldName === "pregrado" || fieldName === "all") {
    if (!form.pregrado) {
      errors.messages.pregrado = "El campo 'Pregrado' es requerido";
      errors.states.pregrado = true;
    } else if (!regexName.test(form.pregrado.trim())) {
      errors.messages.pregrado =
        "El campo 'Pregrado' sólo acepta letras y espacios en blanco";
      errors.states.pregrado = true;
    } else {
      delete errors.messages.pregrado;
      delete errors.states.pregrado;
    }
  }

  if (fieldName === "especializacion" || fieldName === "all") {
    if (!!form.especializacion && !regexName.test(form.especializacion)) {
      errors.messages.especializacion =
        "El campo 'Especializacion' sólo acepta letras y espacios en blanco";
      errors.states.especializacion = true;
    } else {
      delete errors.messages.especializacion;
      delete errors.states.especializacion;
    }
  }

  if (fieldName === "magister" || fieldName === "all") {
    if (!!form.magister && !regexName.test(form.magister.trim())) {
      errors.messages.magister =
        "El campo 'Magister' sólo acepta letras y espacios en blanco";
      errors.states.magister = true;
    } else {
      delete errors.messages.magister;
      delete errors.states.magister;
    }
  }

  if (fieldName === "doctorado" || fieldName === "all") {
    if (!!form.doctorado && !regexName.test(form.doctorado.trim())) {
      errors.messages.doctorado =
        "El campo 'Doctorado' sólo acepta letras y espacios en blanco";
      errors.states.doctorado = true;
    } else {
      delete errors.messages.doctorado;
      delete errors.states.doctorado;
    }
  }

  return errors;
};
