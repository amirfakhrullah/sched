import React from "react";
import Head from "next/head";

const MetaHead = ({ title }: { title?: string }) => {
  return (
    <Head>
      <title>{title || "Sched"}</title>
      <meta name="description" content="Sched App made by @amirfakhrullah" />
      <link rel="icon" href="/sched-logo.png" />
    </Head>
  );
};

export default MetaHead;
