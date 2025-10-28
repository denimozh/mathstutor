"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Bottombar from "@/app/components/Bottombar";
import WorksheetsTable from "@/app/components/WorksheetsTable";
import CreateWorksheetModal from "@/app/components/CreateWorksheetModal";
import { FaPlus } from "react-icons/fa";

const WorksheetsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleWorksheetCreated = () => {
    setRefreshKey(prev => prev + 1); // Force table refresh
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-white overflow-x-hidden">
      {/* Sidebar */}
      <div className="w-fit 2xl:w-[15%] h-screen hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />

      {/* Main Content */}
      <div className="flex-1 p-6 w-full min-w-0 lg:overflow-y-auto scrollbar-hide lg:h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Worksheets</h1>
            <p className="text-gray-500 mt-1">
              Let the AI create exam style practice targeting your specific weaknesses
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <FaPlus />
            Create Exam Style Worksheet
          </button>
        </div>

        {/* Worksheets Table */}
        <WorksheetsTable key={refreshKey} />
      </div>

      {/* Create Worksheet Modal */}
      <CreateWorksheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleWorksheetCreated}
      />
    </div>
  );
};

export default WorksheetsPage;