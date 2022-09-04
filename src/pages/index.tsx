import type { NextPage } from "next";
import MetaHead from "../components/MetaHead";
import Screen from "../components/Screen";
import Sidebar from "../components/Sidebar";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <MetaHead />

      <Screen>
        <Sidebar />
      </Screen>
    </>
  );
};

export default Home;
