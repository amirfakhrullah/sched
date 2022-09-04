import type { NextPage } from "next";
import Center from "../components/Center";
import MetaHead from "../components/MetaHead";
import Schedule from "../components/Schedule";
import Screen from "../components/Screen";
import Sidebar from "../components/Sidebar";

const Home: NextPage = () => {
  return (
    <>
      <MetaHead />

      <Screen>
        <Sidebar />
        <Center>
          <Schedule />
        </Center>
      </Screen>
    </>
  );
};

export default Home;
