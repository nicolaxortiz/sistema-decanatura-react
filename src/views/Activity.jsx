import React from "react";
import Header from "../components/Header";
import "../styles/activityForm.css";
import { Footer } from "../components/Footer";
import { Progress } from "../components/Progress";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";
import ActivityForm from "../components/ActivityForm.jsx";
import ActivityList from "../components/ActivityList.jsx";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function Activity() {
  const { setUser, user, setTab, setProgItems } = React.useContext(UseContext);
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

    setTab(2);
    setProgItems([
      {
        id: 1,
        icon: PersonIcon,
        status: "complete",
      },
      {
        id: 2,
        icon: SchoolIcon,
        status: "incomplete",
      },
      {
        id: 3,
        icon: LibraryBooksIcon,
        status: "incomplete",
      },
      {
        id: 4,
        icon: CalendarMonthIcon,
        status: "incomplete",
      },
    ]);
  }, []);
  return (
    <>
      <Header />
      <Progress />
      <ActivityForm />
      <ActivityList />
      <Footer />
    </>
  );
}
