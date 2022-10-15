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
import { toast } from "react-toastify";

const Home: NextPage = () => {
  const { query } = useRouter();

  const checkQueryParams = (valid: boolean) => {
    const dateCheck = valid
      ? DateValidator.safeParse(query.dayRef).success
      : !DateValidator.safeParse(query.dayRef).success;
    return query.dayRef && typeof query.dayRef === "string" && dateCheck;
  };

  const { data, isLoading } = trpc.useQuery(
    [
      "courses.weeklySchedule",
      {
        dayId: checkQueryParams(true)
          ? moment(query.dayRef).startOf("week").format("yyyyMMDD")
          : moment(new Date()).format("yyyyMMDD"),
      },
    ],
    {
      onSettled: () => {
        if (checkQueryParams(false)) {
          toast.error("Invalid week");
        }
      },
    }
  );

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
