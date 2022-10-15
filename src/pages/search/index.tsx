import React, { useState } from "react";
import Center from "../../components/Center";
import LessonTagQuery from "../../components/Lesson/LessonTagQuery";
import MetaHead from "../../components/MetaHead";
import Screen from "../../components/Screen";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/router";
import { NextPage } from "next";

const Search: NextPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push({ query: { tag: searchValue } });
    }
  };

  return (
    <>
      <MetaHead title="Search by tags | Sched App" />
      <Screen>
        <Sidebar />
        <Center>
          <h2 className="text-4xl font-[700] font-oswald">Search by tags</h2>
          <div className="p-4" />
          <input
            onChange={handleSearch}
            onKeyDown={handleKeyPress}
            placeholder="Type-in the tag name and press Enter"
            className="py-1 px-2 text-gray-900 border border-gray-600 rounded-sm w-full bg-transparent placeholder:text-gray-600"
          />
          {router.query &&
          router.query.tag &&
          typeof router.query.tag === "string" ? (
            <LessonTagQuery tag={router.query.tag} />
          ) : (
            <p className="text-gray-600 text-sm text-center my-5">
              No Notes Found.
            </p>
          )}
        </Center>
      </Screen>
    </>
  );
};

export default Search;
