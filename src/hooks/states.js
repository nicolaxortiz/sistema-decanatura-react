import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function States() {
  const [user, setUser] = React.useState();
  const [configuration, setConfiguration] = React.useState();
  const [tab, setTab] = React.useState(1);
  const [progItems, setProgItems] = React.useState([
    {
      id: 1,
      name: "Datos Personales",
      icon: PersonIcon,
      status: "incomplete",
    },
    {
      id: 2,
      name: "Actividades",
      icon: SchoolIcon,
      status: "incomplete",
    },
    {
      id: 3,
      name: "Productos",
      icon: LibraryBooksIcon,
      status: "incomplete",
    },
    {
      id: 4,
      name: "Horario semanal",
      icon: CalendarMonthIcon,
      status: "incomplete",
    },
  ]);
  const [page, setPage] = React.useState(0);
  const [activities, setActivities] = React.useState();
  const [isFirstActivity, setIsFirstActivity] = React.useState();
  const [dataSchedule, setDataSchedule] = React.useState([]);
  const [option, setOption] = React.useState(1);

  return {
    user,
    setUser,
    tab,
    setTab,
    activities,
    setActivities,
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
    configuration,
    setConfiguration,
  };
}

export default States;
