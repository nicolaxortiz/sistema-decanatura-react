import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import dayjs from "dayjs";
import "../styles/productForm.css";
import TextField from "@mui/material/TextField";
import { ThemeProvider } from "@mui/material/styles";
import { UseContext } from "../context/UseContext.js";
import { theme } from "../resources/theme.js";
import CircularProgress from "@mui/material/CircularProgress";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import { ProductValidation } from "../validations/ProductValidation.js";
import { useForm } from "../hooks/UseForms.js";
import { useNavigate } from "react-router-dom";
import * as APIactividades from "../API/ActivityCall.js";
import ProductButton from "./ProductButton.jsx";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function ProductForm() {
  const isFirstRender = React.useRef(true);
  const [backPage, setBackPage] = React.useState(0);

  const [products, setProducts] = React.useState([]);
  const navigate = useNavigate();
  const {
    actividades,
    setActividades,
    user,
    setIsFirstActivity,
    setTab,
    tab,
    page,
    setPage,
  } = React.useContext(UseContext);

  const [initialForm, setInitialForm] = React.useState({
    comentario: "",
    fechaEstimada: null,
    fechaReal: null,
  });

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  React.useEffect(() => {
    setForm({
      comentario: actividades?.actividad[page]?.producto.comentario || "",
      fechaEstimada:
        actividades?.actividad[page]?.producto.fechaEstimada || null,
      fechaReal: actividades?.actividad[page]?.producto.fechaReal || null,
    });
  }, [actividades, products]);

  const call = APIactividades.saveActivitys;
  const type = "saveLocal";

  const {
    form,
    setForm,
    errors,
    loading,
    response,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(initialForm, ProductValidation, call, type);

  React.useEffect(() => {
    if (isFirstRender.current) {
      setPage(0);
      setBackPage(0);
      isFirstRender.current = false;
      return;
    }

    let productForm = {
      nombre: actividades.actividad[backPage]?.nombre,
      misional: actividades.actividad[backPage]?.misional,
      convencion: actividades.actividad[backPage]?.convencion,
      descripcion: actividades.actividad[backPage]?.descripcion,
      grupo: actividades.actividad[backPage]?.grupo,
      horas: actividades.actividad[backPage]?.horas,
      responsable: actividades.actividad[backPage]?.responsable,
      producto: {
        descripcion: actividades?.actividad[backPage]?.producto.descripcion,
        fechaEstimada: form?.fechaEstimada,
        fechaReal: form?.fechaReal,
        comentario: form?.comentario,
      },
    };

    if (productForm.producto.fechaEstimada !== null) {
      setProducts((prevState) => [...prevState, productForm]);
    }
    setForm(initialForm);
  }, [page]);

  React.useEffect(() => {
    if (response === 200) {
      setBackPage(page);
      setPage(page + 1);
      setMessage("Producto guardado correctamente");
      setCode("success");
      handleClick();
    }
  }, [loading]);

  React.useEffect(() => {
    if (user?._id != undefined) {
      const fetchData = async () => {
        try {
          const responseData = await APIactividades.getbyIdDocenteAndSemester(
            user?._id
          );

          if (responseData.status === 200) {
            localStorage.setItem(
              "Activity",
              JSON.stringify({
                actividad: responseData.data.activity[0].actividad,
                semestre: process.env.REACT_APP_CURRENT_SEMESTER,
                idDocente: user?._id,
                _id: responseData.data.activity[0]._id,
              })
            );

            setActividades((prevState) => ({
              ...prevState,
              actividad: responseData.data.activity[0].actividad,
              _id: responseData.data.activity[0]._id,
            }));
          }
        } catch (error) {
          if (!!actividades) {
            const dataStr = localStorage.getItem("Activity");
            const data = JSON.parse(dataStr);
            if (data) {
              setActividades(data);
            } else {
              navigate("/activity");
            }
          }
        }
      };

      fetchData();
    } else {
    }
  }, [user]);

  return (
    <>
      <div className="form-product">
        <Grid container>
          <Grid xs={12}>
            <div className="title-form">Lista de productos</div>
          </Grid>
        </Grid>
        <ThemeProvider theme={theme}>
          <div className="product-row-w">
            <form onSubmit={handleSubmit}>
              <Grid
                container
                rowSpacing={3}
                columnSpacing={1}
                className="activity-name"
              >
                <Grid xs={12}>
                  <div className="pag-box product-row-g">
                    {page + 1 > actividades?.actividad?.length
                      ? `Productos finalizados`
                      : `Producto ${page + 1} de ${
                          actividades?.actividad?.length || 1
                        }`}
                  </div>
                </Grid>

                <Grid xs={12}>
                  Actividad {page + 1}: {actividades?.actividad[page]?.nombre}
                </Grid>

                <Grid xs={12}>
                  <TextField
                    label="Descripcion"
                    size="small"
                    fullWidth
                    name="descripcion"
                    disabled={page + 1 > actividades?.actividad?.length}
                    value={
                      actividades?.actividad[page]?.producto.descripcion || ""
                    }
                    readOnly
                  />
                </Grid>

                <Grid xs={12} sm={6} md={6} lg={6}>
                  <DatePicker
                    label="Fecha estimada de entrega"
                    disabled={page + 1 > actividades?.actividad?.length}
                    value={
                      form.fechaEstimada === null
                        ? null
                        : dayjs(form.fechaEstimada)
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: errors?.states.fechaEstimada,
                        helperText: errors?.messages.fechaEstimada,
                      },
                    }}
                    onBlur={handleBlur}
                    onChange={(date) =>
                      handleChange({
                        target: {
                          name: "fechaEstimada",
                          value: date,
                          type: "date",
                        },
                      })
                    }
                  />
                </Grid>

                <Grid xs={12} sm={6} md={6} lg={6}>
                  <DatePicker
                    label="Fecha real de entrega"
                    disabled={page + 1 > actividades?.actividad?.length}
                    value={
                      form.fechaReal === null ? null : dayjs(form.fechaReal)
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: errors?.states.fechaReal,
                        helperText: errors?.messages.fechaReal,
                      },
                    }}
                    onBlur={handleBlur}
                    onChange={(date) =>
                      handleChange({
                        target: {
                          name: "fechaReal",
                          value: date,
                          type: "date",
                        },
                      })
                    }
                  />
                </Grid>

                <Grid xs={12}>
                  <TextField
                    label="Comentario"
                    id="outlined-multiline-static"
                    disabled={page + 1 > actividades?.actividad?.length}
                    size="small"
                    fullWidth
                    multiline
                    rows={4}
                    maxRows={4}
                    name="comentario"
                    value={form.comentario}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={errors?.states.comentario}
                    helperText={errors?.messages.comentario}
                  />
                </Grid>

                <Grid xs={12}>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    disabled={page + 1 > actividades?.actividad?.length}
                  >
                    Siguiente producto
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>

          <ProductButton
            state={page + 1 > actividades?.actividad?.length}
            products={products}
          />
        </ThemeProvider>
      </div>

      <Snackbar open={open} onClose={handleClose} autoHideDuration={3000}>
        <Alert
          onClose={handleClose}
          severity={code}
          variant="outlined"
          sx={{ width: "100%", backgroundColor: "white" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
