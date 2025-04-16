"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import MemberCard from "@/components/ui/MemberCard";
import membersData from "@/data/members.json";

const getUniqueYears = (members) => {
  const years = members.map((m) => m.elevationYear);
  return [...new Set(years)].sort((a, b) => b - a);
};

const ITEMS_PER_PAGE = 30;

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [filtered, setFiltered] = useState(membersData);
  const [currentPage, setCurrentPage] = useState(1);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    let result = membersData;

    if (search) {
      result = result.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (year !== "all") {
      result = result.filter((m) => m.elevationYear === parseInt(year));
    }

    setFiltered(result);
    setCurrentPage(1);
    setNoResults(result.length === 0);
  }, [search, year]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0F2C59] mb-8">
        BOSAN Members Directory
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 z-10 relative">
        <Input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-full sm:w-1/4">
            <SelectValue placeholder="Filter by year" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white shadow-lg rounded-md border">
            <SelectItem value="all">All Years</SelectItem>
            {getUniqueYears(membersData).map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {noResults ? (
        <div className="text-red-500 text-xl mb-6">
          No results found for your search.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentItems.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
