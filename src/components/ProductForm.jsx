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
  const { activities, setActivities, user, page, setPage, configuration } =
    React.useContext(UseContext);

  const [initialForm, setInitialForm] = React.useState({
    id: "",
    product: {
      description: "",
      estimated_date: null,
      real_date: null,
      comment: "",
    },
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
      id: (activities && activities[page]?.id) || "",
      product: {
        description:
          (activities && activities[page]?.product.description) || "",
        estimated_date:
          (activities && activities[page]?.product.estimated_date) || null,
        real_date: (activities && activities[page]?.product.real_date) || null,
        comment: (activities && activities[page]?.product.comment) || "",
      },
    });
  }, [activities, products]);

  const call = APIactividades.updateActivity;
  const type = "put";

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
      product: {
        description: activities && activities[backPage]?.product.description,
        estimated_date: form?.estimated_date,
        real_date: form?.real_date,
        comment: form?.comment,
      },
    };

    if (productForm.product.estimated_date !== null) {
      setProducts((prevState) => [...prevState, productForm]);
    }
    setForm(initialForm);
  }, [page]);

  React.useEffect(() => {
    if (response?.status === 200) {
      fetchData();

      setBackPage(page);
      setPage(page + 1);
      setMessage("Producto guardado correctamente");
      setCode("success");
      handleClick();
    }
  }, [response]);

  const fetchData = async () => {
    try {
      const responseData = await APIactividades.getbyIdDocenteAndSemester(
        user?.id,
        configuration?.semester
      );

      if (responseData.status === 200) {
        localStorage.setItem(
          "Activity",
          JSON.stringify({
            activities: responseData.data.activities,
          })
        );

        setActivities(responseData.data.activities);
      }
    } catch (error) {
      if (!!activities) {
        const dataStr = localStorage.getItem("Activity");
        const data = JSON.parse(dataStr);
        if (data) {
          setActivities(data);
        } else {
          navigate("/activity");
        }
      }
    }
  };

  React.useEffect(() => {
    if (user?.id != undefined) {
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
                    {page + 1 > activities?.length
                      ? `Productos finalizados`
                      : `Producto ${page + 1} de ${activities?.length || 1}`}
                  </div>
                </Grid>

                <Grid xs={12}>
                  Actividad {page + 1}:{" "}
                  {activities &&
                    `${activities[page]?.name || ""} ${
                      activities[page]?.description || ""
                    } ${activities[page]?.group_name || ""}`}
                </Grid>

                <Grid xs={12}>
                  <TextField
                    label="Descripción"
                    size="small"
                    fullWidth
                    name="description"
                    disabled={page + 1 > activities?.length}
                    value={
                      (activities && activities[page]?.product.description) ||
                      ""
                    }
                    readOnly
                  />
                </Grid>

                <Grid xs={12} sm={6} md={6} lg={6}>
                  <DatePicker
                    label="Fecha estimada de entrega"
                    disabled={page + 1 > activities?.length}
                    value={
                      form.product.estimated_date === null
                        ? null
                        : dayjs(form.product.estimated_date)
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: errors?.states.estimated_date,
                        helperText: errors?.messages.estimated_date,
                      },
                    }}
                    onBlur={handleBlur}
                    onChange={(date) =>
                      handleChange({
                        target: {
                          name: "estimated_date",
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
                    disabled={page + 1 > activities?.length}
                    value={
                      form.product.real_date === null
                        ? null
                        : dayjs(form.product.real_date)
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: errors?.states.real_date,
                        helperText: errors?.messages.real_date,
                      },
                    }}
                    onBlur={handleBlur}
                    onChange={(date) =>
                      handleChange({
                        target: {
                          name: "real_date",
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
                    disabled={page + 1 > activities?.length}
                    size="small"
                    fullWidth
                    multiline
                    rows={4}
                    maxRows={4}
                    name="comment"
                    value={form.product.comment}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={errors?.states.comment}
                    helperText={errors?.messages.comment}
                  />
                </Grid>

                <Grid xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={page === 0}
                    onClick={() => {
                      setBackPage(page);
                      setPage(page - 1);
                    }}
                  >
                    Anterior producto
                  </Button>
                </Grid>

                <Grid xs={6}>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    disabled={page + 1 > activities?.length}
                  >
                    Siguiente producto
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>

          <ProductButton
            state={page + 1 > activities?.length}
            products={products}
          />
        </ThemeProvider>
      </div>

      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={3000}
      >
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
