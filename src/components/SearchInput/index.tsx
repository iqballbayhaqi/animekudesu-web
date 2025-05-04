'use client'
import React, { useEffect, useState } from "react";

interface SearchInputProps {
  callAction?: (query: string) => void;
}

const SearchInput = ({ callAction }: SearchInputProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      callAction?.(debouncedQuery);
      console.log('Searching for:', debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <div className="bg-[#141519] flex justify-center items-center">
      <input
        placeholder="Search"
        className="sm:text-5xl text-xl outline-0 border-b-2 my-8 hover:border-blue-500 focus:border-blue-500"
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
