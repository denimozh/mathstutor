"use client"

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { FaHome } from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPenFancy } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

const Bottombar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-100 border-t border-slate-200 flex justify-around p-2 md:hidden">
      <BottomBarItem icon={<FaHome />} link="/dashboard" />
      <BottomBarItem icon={<FaWandMagicSparkles />} link="/dashboard/solve" />
      <BottomBarItem icon={<FaFileAlt />} link="/dashboard/worksheet" />
      <BottomBarItem icon={<FaCalendarAlt />} link="/dashboard/revision" />
      <BottomBarItem icon={<FaPenFancy />} link="/dashboard/deepwork" />
      <BottomBarItem icon={<FaHistory />} link="/dashboard/history" />
      <BottomBarItem icon={<FaGear />} link="/dashboard/settings" />
    </div>
  );
};

function BottomBarItem({ icon, link }) {
  const pathname = usePathname();
  const isActive = pathname === link || pathname.startsWith(link + '/');

  return (
    <Link
      href={link}
      className={`flex flex-col items-center justify-center p-2 rounded-md transition-all duration-200
        ${isActive ? 'text-violet-500' : 'text-slate-400 hover:text-violet-400'}`}
    >
      <span className="text-2xl">{icon}</span>
    </Link>
  );
}

export default Bottombar;
