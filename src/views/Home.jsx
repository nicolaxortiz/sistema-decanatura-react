import React from "react";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { Progress } from "../components/Progress";
import PersonalForm from "../components/PersonalForm";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { setUser, user, tab, setTab } = React.useContext(UseContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    const dataStr = localStorage.getItem("User");
    const data = JSON.parse(dataStr);

    if (!user) {
      if (!data) {
        navigate("/");
        setUser();
      } else {
        setUser(data);
      }
    }

    setTab(1);
  }, []);

  return (
    <>
      <Header />
      <Progress />
      <PersonalForm />
      <Footer />
    </>
  );
};
