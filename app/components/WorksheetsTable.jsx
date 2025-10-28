"use client";

import React, { useState, useEffect } from "react";
import { FaMedal, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

const WorksheetsTable = ({ refreshTrigger }) => {
  const [worksheets, setWorksheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();

  const fetchWorksheets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/worksheets");
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setWorksheets(json.data);
      } else {
        console.error("Invalid worksheet data:", json);
        setWorksheets([]);
      }
    } catch (err) {
      console.error("Error fetching worksheets:", err);
      setWorksheets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorksheets();
  }, [refreshTrigger]);

  const totalPages = Math.ceil((worksheets?.length || 0) / itemsPerPage);
  console.log("worksheets length:", worksheets.length);

  const paginatedData = worksheets?.slice
    ? worksheets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const getDiffColor = (difficulty) => {
    switch (difficulty) {
      case "Bronze":
        return "text-yellow-900";
      case "Silver":
        return "text-slate-600";
      case "Gold":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  const getDiffIcon = (difficulty) => {
    switch (difficulty) {
      case "Bronze":
        return <FaMedal size={16} className="text-yellow-900" />;
      case "Silver":
        return <FaMedal size={16} className="text-slate-600" />;
      case "Gold":
        return <FaMedal size={16} className="text-amber-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg">Loading worksheets...</p>
      </div>
    );
  }

  if (!worksheets || worksheets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="bg-indigo-100 rounded-full p-6 mb-4">
          <FaPlus className="text-indigo-600 text-4xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No worksheets yet</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          Create your first exam-style worksheet to practice questions targeting your weak topics.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-violet-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created At</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Difficulty</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Questions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                onClick={() => router.push(`/dashboard/worksheet/${item.id}`)}
                className="cursor-pointer hover:bg-violet-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(item.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.title || "Untitled"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getDiffColor(item.difficulty)}`}>
                      {item.difficulty || "N/A"}
                    </span>
                    {getDiffIcon(item.difficulty)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {item.question_ids?.length || 0}
                    </span>
                    <span className="text-xs text-gray-500">questions</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <button
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WorksheetsTable;