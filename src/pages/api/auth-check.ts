import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

const authCheck = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (session) {
    return res.status(200).end();
  } else {
    return res.status(401).end();
  }
};

export default authCheck;
