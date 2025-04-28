import React from "react";

function States() {
  const [sesionInvalid, setSesionInvalid] = React.useState(false);
  const [user, setUser] = React.useState();
  const [configuration, setConfiguration] = React.useState({});
  const [tab, setTab] = React.useState(1);
  const [page, setPage] = React.useState(0);
  const [activities, setActivities] = React.useState();
  const [isFirstActivity, setIsFirstActivity] = React.useState();
  const [dataSchedule, setDataSchedule] = React.useState([]);
  const [option, setOption] = React.useState(1);

  return {
    sesionInvalid,
    setSesionInvalid,
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
    option,
    setOption,
    configuration,
    setConfiguration,
  };
}

export default States;
