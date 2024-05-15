import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function States() {
  const semester = process.env.REACT_APP_CURRENT_SEMESTER;
  const [user, setUser] = React.useState();
  const [tab, setTab] = React.useState(1);
  const [progItems, setProgItems] = React.useState([
    {
      id: 1,
      icon: PersonIcon,
      status: "incomplete",
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
  const [page, setPage] = React.useState(0);
  const [actividades, setActividades] = React.useState({
    idDocente: "",
    actividad: [],
    semestre: semester,
  });
  const [isFirstActivity, setIsFirstActivity] = React.useState();
  const [dataSchedule, setDataSchedule] = React.useState([]);
  const [option, setOption] = React.useState(1);

  React.useEffect(() => {
    setActividades((prevState) => ({
      actividad: [],
      semestre: semester,
      idDocente: user?._id,
    }));
  }, [user]);

  return {
    user,
    setUser,
    tab,
    setTab,
    actividades,
    setActividades,
    isFirstActivity,
    setIsFirstActivity,
    page,
    setPage,
    dataSchedule,
    setDataSchedule,
    progItems,
    setProgItems,
    option,
    setOption,
  };
}

export default States;
