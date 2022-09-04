import React from "react";
import Head from "next/head";

const MetaHead = ({ title }: { title?: string }) => {
  return (
    <Head>
      <title>{title || "Schedule"}</title>
      <meta name="description" content="Generated by create-t3-app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default MetaHead;
