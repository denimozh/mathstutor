"use client";

import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const PastActivitiesTable = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/activity/recent");
      const data = await res.json();

      if (data.success) {
        setActivities(data.data);
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const paginatedActivities = activities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffInHours < 48) {
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      const daysAgo = Math.floor(diffInHours / 24);
      return `${daysAgo} days ago, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0s";
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-center text-gray-500">
          No recent activity yet. Start solving questions!
        </p>
      </div>
    );
  }

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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedActivities.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(item.created_at)}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.activity_type === "question_solved"
                    ? "Solved question"
                    : item.activity_type === "worksheet_generated"
                    ? "Generated worksheet"
                    : item.activity_type === "deep_work_session"
                    ? "Deep work session"
                    : item.activity_type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.topic || "General"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      )}
    </div>
  );
};

export default PastActivitiesTable;
