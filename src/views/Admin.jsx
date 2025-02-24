import React from "react";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import Options from "../components/Options";
import AllTeachers from "../components/AllTeachers.jsx";
import AllActivity from "../components/AllActivity.jsx";
import AdminDocument from "../components/AdminDocument.jsx";

function Admin() {
  const navigate = useNavigate();
  const { setUser, user, option, setOption } = React.useContext(UseContext);
  React.useEffect(() => {
    const dataStr = localStorage.getItem("User");
    const data = JSON.parse(dataStr);

    if (!user) {
      if (!data) {
        navigate("/");
        setUser();
      } else {
        if (data.role !== "admin") {
          setUser(data);
          navigate("/home");
        } else {
          setUser(data);
        }
      }
    }
  }, []);
  return (
    <>
      <Header />
      <Options />
      {option === 1 && <AdminDocument />}
      {option === 2 && <AllTeachers />}
      {option === 3 && <AllActivity />}
      <Footer />
    </>
  );
}

export default Admin;
