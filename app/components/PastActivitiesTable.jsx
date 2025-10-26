"use client"

import React, { useState } from "react";

// Mock data for past activities
const mockActivities = [
  { id: 1, activity: "Asking for help", date: "2025-10-25", user: "Alice" },
  { id: 2, activity: "Sending a question", date: "2025-10-24", user: "Bob" },
  { id: 3, activity: "Creating a worksheet", date: "2025-10-23", user: "Charlie" },
  { id: 4, activity: "Completing a worksheet", date: "2025-10-22", user: "Dana" },
  { id: 5, activity: "Asking for help", date: "2025-10-21", user: "Eve" },
  { id: 6, activity: "Sending a question", date: "2025-10-20", user: "Frank" },
  { id: 7, activity: "Creating a worksheet", date: "2025-10-19", user: "Grace" },
  { id: 8, activity: "Completing a worksheet", date: "2025-10-18", user: "Hank" },
];

const PastActivitiesTable = () => {
  const [activities, setActivities] = useState(mockActivities);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Sorting by date
  const handleSort = () => {
    const sorted = [...activities].sort((a, b) => {
      if (sortOrder === "asc") return new Date(a.date) - new Date(b.date);
      else return new Date(b.date) - new Date(a.date);
    });
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setActivities(sorted);
  };

  // Pagination
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const paginatedActivities = activities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="">
      {/* Table */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-violet-300">
            <th
              className="border px-4 py-2 text-left cursor-pointer"
              onClick={handleSort}
            >
              Date {sortOrder === "asc" ? "▲" : "▼"}
            </th>
            <th className="border px-4 py-2 text-left">Activity</th>
            <th className="border px-4 py-2 text-left">Topic</th>
          </tr>
        </thead>
        <tbody>
          {paginatedActivities.map((item) => (
            <tr key={item.id} className="hover:bg-violet-100">
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.activity}</td>
              <td className="border px-4 py-2">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="mt-4 flex gap-2">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-2 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PastActivitiesTable;
