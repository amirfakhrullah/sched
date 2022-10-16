import React, { useEffect, useState } from "react";
import Center from "../../components/Center";
import LessonTagQuery from "../../components/Lesson/LessonTagQuery";
import MetaHead from "../../components/MetaHead";
import Screen from "../../components/Screen";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/router";
import { NextPage } from "next";

const Search: NextPage = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (router.query?.tag && !searchValue) {
        return router.push({ query: {} });
      }
      router.push({ query: { tag: searchValue } });
    }
  };

  useEffect(() => {
    if (
      router.query &&
      router.query.tag &&
      typeof router.query.tag === "string" &&
      searchValue !== router.query.tag
    ) {
      setSearchValue(router.query.tag);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <>
      <MetaHead title="Search by tags | Sched App" />
      <Screen>
        <Sidebar />
        <Center>
          <h2 className="text-4xl font-[700] font-oswald">Search by tags</h2>
          <div className="p-4" />
          <input
            value={searchValue}
            onChange={handleSearch}
            onKeyDown={handleKeyPress}
            placeholder="Type-in the tag name and press Enter"
            className="py-1 px-2 text-gray-900 border border-gray-600 rounded-sm w-full bg-transparent placeholder:text-gray-600"
          />
          {router.query &&
            router.query.tag &&
            typeof router.query.tag === "string" && (
              <LessonTagQuery tag={router.query.tag} />
            )}
        </Center>
      </Screen>
    </>
  );
};

export default Search;
