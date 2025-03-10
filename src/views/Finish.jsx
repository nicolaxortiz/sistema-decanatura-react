import React from "react";
import { Progress } from "../components/Progress";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FinishForm from "../components/FinishForm.jsx";

function Finish() {
  const { setUser, user, setTab, setProgItems, setConfiguration } =
    React.useContext(UseContext);
  const navigate = useNavigate();

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

    setProgItems([
      {
        id: 1,
        name: "Datos Personales",
        icon: PersonIcon,
        status: "complete",
      },
      {
        id: 2,
        name: "Actividades",
        icon: SchoolIcon,
        status: "complete",
      },
      {
        id: 3,
        name: "Productos",
        icon: LibraryBooksIcon,
        status: "complete",
      },
      {
        id: 4,
        name: "Horario semanal",
        icon: CalendarMonthIcon,
        status: "complete",
      },
    ]);
    setTab(5);
  }, []);
  return (
    <>
      <Header />
      <Progress />
      <FinishForm />
      <Footer />
    </>
  );
}

export default Finish;
