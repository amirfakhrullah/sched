import type { NextPage } from "next";
import Center from "../components/Center";
import MetaHead from "../components/MetaHead";
import Schedule from "../components/Schedule";
import Screen from "../components/Screen";
import Sidebar from "../components/Sidebar";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { DateValidator } from "../helpers/validations/shared";
import moment from "moment";

const Home: NextPage = () => {
  const { query } = useRouter();
  const { data, isLoading } = trpc.useQuery([
    "courses.weeklySchedule",
    {
      dayId:
        query.dayRef &&
        typeof query.dayRef === "string" &&
        DateValidator.safeParse(query.dayRef).success
          ? moment(query.dayRef).startOf("week").format("yyyyMMDD")
          : moment(new Date()).format("yyyyMMDD"),
    },
  ]);

  return (
    <>
      <MetaHead />
      <Screen>
        <Sidebar />
        <Center loader={isLoading || !data}>
          {data && <Schedule data={data} />}
        </Center>
      </Screen>
    </>
  );
};

export default Home;
