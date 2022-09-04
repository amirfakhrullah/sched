import React from "react";
import MetaHead from "../../components/MetaHead";
import Screen from "../../components/Screen";
import Sidebar from "../../components/Sidebar";

const Courses = () => {
  return (
    <>
      <MetaHead title="Courses | Schedule" />

      <Screen>
        <Sidebar />
      </Screen>
    </>
  );
};

export default Courses;
