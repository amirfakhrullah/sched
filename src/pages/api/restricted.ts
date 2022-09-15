// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (session) {
    return res.status(200).end();
  } else {
    return res.status(401).end();
  }
};

export default restricted;
