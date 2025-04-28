import React from "react";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { Progress } from "../components/Progress";
import PersonalForm from "../components/PersonalForm";
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList.jsx";
import ProductForm from "../components/ProductForm.jsx";
import ScheduleTable from "../components/ScheduleTable.jsx";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FinishSesionModal from "../components/FinishSesionModal.jsx";
import FinishForm from "../components/FinishForm.jsx";

function Teacher() {
  const navigate = useNavigate();
  const { setUser, user, setTab, setConfiguration, tab } =
    React.useContext(UseContext);

  const optionsList = [
    {
      id: 1,
      name: "Datos Personales",
      icon: PersonIcon,
      status: "incomplete",
    },
    {
      id: 2,
      name: "Actividades",
      icon: SchoolIcon,
      status: "incomplete",
    },
    {
      id: 3,
      name: "Productos",
      icon: LibraryBooksIcon,
      status: "incomplete",
    },
    {
      id: 4,
      name: "Horario semanal",
      icon: CalendarMonthIcon,
      status: "incomplete",
    },
  ];

  React.useEffect(() => {
    const dataStr = localStorage.getItem("User");
    const data = JSON.parse(dataStr);

    const confDataStr = localStorage.getItem("Configuration");
    const confData = JSON.parse(confDataStr);

    if (!user) {
      if (!data) {
        navigate("/");
        setUser();
        setConfiguration();
      } else {
        setUser(data);
        setConfiguration(confData);
      }
    }

    if (!user) {
      if (!data) {
        navigate("/");
        setUser();
        setConfiguration();
      } else {
        setUser(data);
        setConfiguration(confData);

        if (data?.role === "campus") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    }
  }, []);

  return (
    <>
      <Header />
      <Progress list={optionsList} />
      {tab === 1 && <PersonalForm />}
      {tab === 2 && (
        <>
          <ActivityForm />
          <ActivityList />
        </>
      )}
      {tab === 3 && <ProductForm />}
      {tab === 4 && <ScheduleTable />}
      {tab === 5 && <FinishForm />}
      <Footer />
      <FinishSesionModal />
    </>
  );
}

export default Teacher;
