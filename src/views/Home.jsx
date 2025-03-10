import React from "react";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { Progress } from "../components/Progress";
import PersonalForm from "../components/PersonalForm";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { setUser, user, setTab, setConfiguration } =
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
