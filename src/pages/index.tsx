import { useState } from "react";
import type { NextPage } from "next";
import Center from "../components/Center";
import MetaHead from "../components/MetaHead";
import Schedule from "../components/Schedule";
import Screen from "../components/Screen";
import Sidebar from "../components/Sidebar";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [dayId, setDayId] = useState<string | undefined>(undefined);
  const { data, isLoading  } = trpc.useQuery([
    "courses.weeklySchedule",
    {
      dayId,
    }
  ]);

  return (
    <>
      <MetaHead />
      <Screen>
        <Sidebar />
        <Center loader={isLoading || !data}>
          {data && <Schedule data={data} setDayId={setDayId} />}
        </Center>
      </Screen>
    </>
  );
};

export default Home;
