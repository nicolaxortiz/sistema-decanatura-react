import React from "react";
import Header from "../components/Header";
import { Progress } from "../components/Progress";
import { Footer } from "../components/Footer";
import { UseContext } from "../context/UseContext.js";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleTable from "../components/ScheduleTable.jsx";

function Schedule() {
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
    setTab(4);

    setProgItems([
      {
        id: 1,
        icon: PersonIcon,
        status: "complete",
      },
      {
        id: 2,
        icon: SchoolIcon,
        status: "complete",
      },
      {
        id: 3,
        icon: LibraryBooksIcon,
        status: "complete",
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
      <ScheduleTable />
      <Footer />
    </>
  );
}

export default Schedule;
