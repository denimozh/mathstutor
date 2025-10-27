"use client"

import React, { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

// Mock data for past activities matching the dashboard mockup
const mockActivities = [
  { 
    id: 1, 
    date: "Today, 2:34 PM", 
    activity: "Solved question", 
    topic: "Integration by Parts", 
    result: "correct",
    time: "3m 24s"
  },
  { 
    id: 2, 
    date: "Today, 2:28 PM", 
    activity: "Solved question", 
    topic: "Chain Rule", 
    result: "incorrect",
    time: "5m 12s"
  },
  { 
    id: 3, 
    date: "Yesterday, 4:15 PM", 
    activity: "Generated worksheet", 
    topic: "Trigonometric Identities", 
    result: "completed",
    time: "25m"
  },
  { 
    id: 4, 
    date: "Yesterday, 3:45 PM", 
    activity: "Deep work session", 
    topic: "Mixed Topics", 
    result: "completed",
    time: "45m"
  },
  { 
    id: 5, 
    date: "2 days ago, 5:20 PM", 
    activity: "Solved question", 
    topic: "Differentiation", 
    result: "correct",
    time: "2m 15s"
  },
  { 
    id: 6, 
    date: "2 days ago, 4:50 PM", 
    activity: "Solved question", 
    topic: "Algebra", 
    result: "incorrect",
    time: "8m 30s"
  },
];

const PastActivitiesTable = () => {
  const [activities] = useState(mockActivities);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Pagination
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const paginatedActivities = activities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getResultColor = (result) => {
    switch(result) {
      case 'correct':
        return 'text-emerald-600';
      case 'incorrect':
        return 'text-rose-600';
      default:
        return 'text-gray-600';
    }
  };

  const getResultIcon = (result) => {
    switch(result) {
      case 'correct':
        return <FaCheck size={16} className="text-emerald-600" />;
      case 'incorrect':
        return <FaTimes size={16} className="text-rose-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Topic
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Result
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedActivities.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.date}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.activity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.topic}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getResultIcon(item.result)}
                    <span className={`text-sm font-medium ${getResultColor(item.result)}`}>
                      {item.result}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({item.time})
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex items-center justify-between">
        <button
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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