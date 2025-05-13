import React from "react";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import Options from "../components/Options";
import AllTeachers from "../components/AllTeachers.jsx";
import AllActivity from "../components/AllActivity.jsx";
import PersonIcon from "@mui/icons-material/Person";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BuildIcon from "@mui/icons-material/Build";
import ArticleIcon from "@mui/icons-material/Article";
import FinishSesionModal from "../components/FinishSesionModal.jsx";
import CoordinatorConfiguration from "../components/CoordinatorConfiguration.jsx";
import DeanHome from "../components/DeanHome.jsx";
import DeanFormatList from "../components/DeanFormatList.jsx";
import DeanConfiguration from "../components/DeanConfiguration.jsx";

function Dean() {
  const navigate = useNavigate();
  const { setUser, user, option, setConfiguration } =
    React.useContext(UseContext);

  const optionList = [
    { id: 1, name: "Documentos", icon: ArticleIcon },
    { id: 2, name: "Formatos", icon: LibraryBooksIcon },
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
        if (data.role !== "dean") {
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
      {option === 1 && <DeanHome />}
      {option === 2 && <DeanFormatList />}
      {option === 3 && <DeanConfiguration />}
      <Footer />
      <FinishSesionModal />
    </>
  );
}

export default Dean;
