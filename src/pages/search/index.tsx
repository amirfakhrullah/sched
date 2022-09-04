import React from "react";
import MetaHead from "../../components/MetaHead";
import Screen from "../../components/Screen";
import Sidebar from "../../components/Sidebar";

const index = () => {
  return (
    <>
      <MetaHead title="Search by tags | Schedule" />

      <Screen>
        <Sidebar />
      </Screen>
    </>
  );
};

export default index;
