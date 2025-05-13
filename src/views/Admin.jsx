import React from "react";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import Options from "../components/Options.jsx";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import BuildIcon from "@mui/icons-material/Build";
import SchoolIcon from "@mui/icons-material/School";
import AllPrograms from "../components/AllPrograms.jsx";
import AllCoordinators from "../components/AllCoordinators.jsx";
import CampusConfiguration from "../components/CampusConfiguration.jsx";
import FinishSesionModal from "../components/FinishSesionModal.jsx";
import AllDeans from "../components/AllDeans.jsx";

export default function Admin() {
  const navigate = useNavigate();
  const { setUser, user, option, setConfiguration } =
    React.useContext(UseContext);

  const optionList = [
    { id: 1, name: "Programas", icon: AccountBalanceIcon },
    { id: 2, name: "Coordinadores", icon: RecordVoiceOverIcon },
    { id: 3, name: "Decanos", icon: SchoolIcon },
    { id: 4, name: "Configuración", icon: BuildIcon },
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
        if (data.role !== "campus") {
          navigate("/");
        } else {
          setUser(data);
          setConfiguration(confData);
        }
      }
    }
  }, []);

  return (
    <>
      <Header />
      <Options list={optionList} />
      {option === 1 && <AllPrograms />}
      {option === 2 && <AllCoordinators />}
      {option === 3 && <AllDeans />}
      {option === 4 && <CampusConfiguration />}
      <Footer />
      <FinishSesionModal />
    </>
  );
}
