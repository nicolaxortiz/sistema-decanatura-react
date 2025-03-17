import React from "react";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import Options from "../components/Options.jsx";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import BuildIcon from "@mui/icons-material/Build";
import AllPrograms from "../components/AllPrograms.jsx";
import AllCoordinators from "../components/AllCoordinators.jsx";

export default function Admin() {
  const navigate = useNavigate();
  const { setUser, user, option, setConfiguration } =
    React.useContext(UseContext);

  const optionList = [
    { id: 1, name: "Programas", icon: AccountBalanceIcon },
    { id: 2, name: "Coordinadores", icon: RecordVoiceOverIcon },
    { id: 3, name: "Configuración", icon: BuildIcon },
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
          setUser(data);
          setConfiguration(confData);
          if (data.role === "coordinator") {
            navigate("/coordinator");
          } else {
            navigate("/home");
          }
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
      <Footer />
    </>
  );
}
