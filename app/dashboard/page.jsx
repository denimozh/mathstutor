import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Sidebar from '../components/Sidebar';
import { FaUser } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaCentos } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import Link from 'next/link';
import TopicMasteryCard from '../components/SubjectCard';
import SubjectCard from '../components/SubjectCard';
import PastActivitiesTable from '../components/PastActivitiesTable';
import Bottombar from '../components/Bottombar';

export default async function Page() {
  const subjects = [
  {
    name: "Mathematics",
    score: 85,
    questions: 120,
    borderClass: "border-blue-500",
    bgClass: "bg-blue-100",
  },
  {
    name: "Physics",
    score: 72,
    questions: 98,
    borderClass: "border-red-500",
    bgClass: "bg-red-100",
  },
  {
    name: "Chemistry",
    score: 90,
    questions: 110,
    borderClass: "border-green-500",
    bgClass: "bg-green-100",
  },
  {
    name: "Biology",
    score: 65,
    questions: 80,
    borderClass: "border-yellow-500",
    bgClass: "bg-yellow-100",
  },
  {
    name: "History",
    score: 78,
    questions: 70,
    borderClass: "border-purple-500",
    bgClass: "bg-purple-100",
  },
  {
    name: "Geography",
    score: 82,
    questions: 85,
    borderClass: "border-teal-500",
    bgClass: "bg-teal-100",
  },
  {
    name: "English",
    score: 88,
    questions: 100,
    borderClass: "border-pink-500",
    bgClass: "bg-pink-100",
  },
];

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  return (
    <main className='w-full h-screen flex flex-row bg-white'>
      {/* Sidebar width: 15% on laptop+, w-fit on smaller screens */}
      <div className="w-fit 2xl:w-[15%] h-full hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />
      <div className='flex flex-col lg:flex-row w-full h-full min-w-0'>
        <div className='flex-1 p-6 lg:w-[75%] xl:w-[80%] w-full min-w-0'>
          <p className='text-2xl'>Dashboard</p>
          <p className=' text-slate-400 text-[14px] xl:text-lg'>Welcome back, {data.user.email.split('@')[0]}! Ready to continue learning! 🚀</p>
          <div className='flex flex-col w-full gap-3 pt-5'>
            <div className='flex flex-col lg:flex-row gap-4 w-full'>
              <Link href={"/dashboard/solve"} className='group w-full lg:w-1/3 flex flex-row justify-between items-center border border-green-500 bg-green-300 group-hover:cursor-pointer hover:bg-green-400 hover:text-white transition-all duration-200 rounded-xl h-20 p-5'>
                <p className=''>Solve Question</p>
                <FaArrowRight className='bg-white p-1 rounded-full w-8 h-8 group-hover:text-green-400 transition-all duration-200'/>
              </Link>
              <Link href={"/dashboard/worksheet"} className='group w-full lg:w-1/3 flex flex-row justify-between items-center border border-blue-500 bg-blue-300 hover:cursor-pointer hover:bg-blue-400 hover:text-white transition-all duration-200 rounded-xl h-20 p-5'>
                <p>Generate Practise</p>
                <FaFileAlt className='bg-white p-1 rounded-full w-8 h-8 group-hover:text-blue-400 transition-all duration-200'/>
              </Link>
              <Link href={"/dashboard/deepwork"} className='group w-full lg:w-1/3 flex flex-row justify-between items-center border border-amber-500 bg-amber-300 hover:cursor-pointer hover:bg-amber-400 hover:text-white transition-all duration-200 rounded-xl h-20 p-5'>
                <p>Start Deep Work</p>
                <FaCentos className='bg-white p-1 rounded-full w-8 h-8 group-hover:text-amber-400 transition-all duration-200'/>
              </Link>
            </div>
            <div className="flex flex-col w-full min-w-0 pt-5">
              <p className="text-2xl">Topic Mastery</p>
              <p className="text-[14px] xl:text-lg pb-5 text-slate-400">
                Progress Overview - Here is an overview of your mastery levels 🎯
              </p>

              {subjects.length === 0 ? (
                <div className="flex flex-col gap-4 rounded-xl items-center justify-center h-48 w-72 border border-gray-400 bg-gray-200 p-6 text-center">
                  <p className="text-xl font-semibold">No topics yet</p>
                  <p className="text-sm">
                    Ask the tutorAI questions to start tracking your topic mastery.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full bg-slate-100 p-4 rounded-xl">
                  <div className="flex gap-4 flex-nowrap min-w-0">
                    {subjects.map((subject) => (
                      <div key={subject.name} className="flex-shrink-0">
                        <SubjectCard
                          subject={subject.name}
                          score={subject.score}
                          questions={subject.questions}
                          borderClass={subject.borderClass}
                          bgClass={subject.bgClass}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className='flex flex-col w-full pt-5'>
              <p className='text-2xl'>Recent Activity</p>
              <div className='py-4'>
                <PastActivitiesTable />
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4 w-full h-full lg:w-[25%] xl:w-[20%] bg-violet-300 items-center px-3 py-4 2xl:px-8'>
              <FaUser className='bg-white text-black w-14 h-14 p-2 rounded-full'/>
              <p className='text-2xl'>{data.user.email.split('@')[0]}</p>
              <p className='text-md text-slate-700'>Free plan</p>
              <div className='block border-b border-slate-400 px-4 w-full py-2'></div>
              <Link href={"/dashboard/settings"} className='mt-2 px-10 py-2 border-2 border-violet-700 rounded-2xl text-violet-600 hover:cursor-pointer hover:bg-violet-700 hover:text-white transition-all duration-200'>
                Edit Plan
              </Link>
              <div className='px-10 py-2 border-2 border-red-700 rounded-2xl text-red-600 hover:cursor-pointer hover:bg-red-700 hover:text-white transition-all duration-200'>
                Log Out
              </div>
              <div className='block border-b border-slate-400 px-4 w-full py-2'></div>
              <div className='border border-violet-400 bg-violet-200 w-full rounded-xl p-5'>
                <div className="flex flex-col gap-2 w-full items-center justify-center space-y-1">
                  <p className="text-[60px] lg:text-[100px] -mb-4 font-bold bg-gradient-to-b from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                    0
                  </p>
                <p className="text-[20px] text-orange-400 lg:text-[30px] font-medium -mt-1">
                  Streak
                </p>
                <p className='text-slate-500 pt-2 text-sm'>Consistency is key to success!</p>
                </div>
              </div>
        </div>
      </div>
    </main>
  );
}
