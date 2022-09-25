import React, { useState } from "react";
import Center from "../../components/Center";
import LessonTagQuery from "../../components/Lesson/LessonTagQuery";
import MetaHead from "../../components/MetaHead";
import Screen from "../../components/Screen";
import Sidebar from "../../components/Sidebar";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tag, setTag] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setTag(searchValue);
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
          {tag && <LessonTagQuery tag={tag} />}
        </Center>
      </Screen>
    </>
  );
};

export default Search;
