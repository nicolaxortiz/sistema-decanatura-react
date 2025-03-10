import React from "react";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import Options from "../components/Options";
import AllTeachers from "../components/AllTeachers.jsx";
import AllActivity from "../components/AllActivity.jsx";
import CoordinatorHome from "../components/CoordinatorHome.jsx";
import PersonIcon from "@mui/icons-material/Person";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ArticleIcon from "@mui/icons-material/Article";

export default function Coordinator() {
  const navigate = useNavigate();
  const { setUser, user, option, setConfiguration } =
    React.useContext(UseContext);

  const optionList = [
    { id: 1, name: "Documentos", icon: ArticleIcon },
    { id: 2, name: "Docentes", icon: PersonIcon },
    { id: 3, name: "Formatos", icon: LibraryBooksIcon },
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
        if (data.role !== "coordinator") {
          setUser(data);
          setConfiguration(confData);
          if (data.role === "campus") {
            navigate("/admin");
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
      {option === 1 && <CoordinatorHome />}
      {option === 2 && <AllTeachers />}
      {option === 3 && <AllActivity />}
      <Footer />
    </>
  );
}
