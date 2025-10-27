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

const Sidebar = () => {
  return (
    <div className='h-full flex flex-col p-4 bg-slate-100 w-full transition-all duration-300'>
      {/* Brand name (hidden on iPad/smaller) */}
      <p className='hidden 2xl:block text-2xl xl:text-4xl mb-4'>
        <span className='text-violet-500'>Maths</span>Tutor
      </p>
      <div className='hidden 2xl:block border-b border-slate-200 mb-4'></div>
      <div className='flex flex-col justify-between h-full pt-6'>
        <div className='flex flex-col gap-2'>
          <SidebarItem icon={<FaHome />} text="Home" link="/dashboard" />
          <SidebarItem icon={<FaWandMagicSparkles />} text="Tutor" link="/dashboard/solve" />
          <SidebarItem icon={<FaFileAlt />} text="Worksheets" link="/dashboard/worksheet" />
          <SidebarItem icon={<FaCalendarAlt />} text="Revision" link="/dashboard/revision" />
          <SidebarItem icon={<FaPenFancy />} text="Deepwork" link="/dashboard/deepwork" />
        </div>

        <div className='flex flex-col gap-2'>
          <SidebarItem icon={<FaHistory />} text="History" link="/dashboard/history" />
          <SidebarItem icon={<FaGear />} text="Settings" link="/dashboard/settings" />
        </div>
      </div>
    </div>
  );
};

export function SidebarItem({ icon, text, link }) {
  const pathname = usePathname();
  const isActive =
    pathname === link ||
    (link !== '/dashboard' && pathname.startsWith(link + '/'));

  return (
    <Link
      href={link}
      className={`
        group flex items-center justify-center lg:justify-start
        gap-4 px-4 py-3 rounded-xl transition-all duration-200
        ${isActive ? 'bg-violet-500 text-white' : 'hover:bg-violet-400'}
      `}
    >
      <span className={`text-2xl ${isActive ? 'text-white' : 'text-slate-400'} group-hover:text-slate-200`}>
        {icon}
      </span>
      <span className='hidden 2xl:inline text-[16px] group-hover:text-white'>
        {text}
      </span>
    </Link>
  );
}

export default Sidebar;

