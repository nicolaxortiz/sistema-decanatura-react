import { useState } from "react";

export const useForm = (initialForm, validateForm, executeOnSubmit, type) => {
  const [errors, setErrors] = useState({ messages: {}, states: {} });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [form, setForm] = useState(initialForm);

  const handleChange = async (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setForm({
        ...form,
        [name]: e.target.files[0],
      });
    } else if (
      type === "date" &&
      !isNaN(value?.$D) &&
      !isNaN(value?.$M) &&
      !isNaN(value?.$y)
    ) {
      let parseDate = `${value?.$d.toISOString()}`;

      if (name === "estimated_date" || name === "real_date") {
        setForm({
          ...form,
          product: { ...form.product, [name]: parseDate },
        });
      } else {
        setForm({
          ...form,
          [name]: parseDate,
        });
      }
    } else if (type !== "file" && type !== "date") {
      if (name === "comment") {
        setForm({
          ...form,
          product: { ...form.product, [name]: value },
        });
      } else {
        setForm({
          ...form,
          [name]: value,
        });
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    handleChange(e);
    setErrors(validateForm(form, name, errors));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleChange(e);
    setErrors(validateForm(form, "all", errors));

    if (Object.keys(errors.messages).length === 0) {
      try {
        setLoading(true);

        if (type === "put") {
          const responseRequest = await executeOnSubmit(form.id, form);
          setResponse(responseRequest);
          setLoading(false);
        } else if (type === "post") {
          const responseRequest = await executeOnSubmit(form);
          setResponse(responseRequest);
          setLoading(false);
        } else if (type === "saveLocal") {
          setLoading(!loading);
          setResponse(200);
        }
      } catch (error) {
        setResponse({ status: "error" });
      }
    } else {
      console.log(errors);
    }
  };

  return {
    form,
    setForm,
    errors,
    loading,
    response,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};
