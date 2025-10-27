import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server.js';
import Sidebar from '../components/Sidebar';
import { FaUser, FaArrowRight, FaCentos, FaFileAlt, FaFire, FaCheck, FaTimes, FaBullseye, FaArrowUp, FaArrowDown } from "react-icons/fa";
import Link from 'next/link';
import SubjectCard from '../components/SubjectCard';
import PastActivitiesTable from '../components/PastActivitiesTable';
import Bottombar from '../components/Bottombar';

export default async function Page() {
  // Changed to A-Level Maths topics instead of multiple subjects
  const mathTopics = [
    {
      name: "Differentiation",
      score: 85,
      solved: 47,
      toMaster: 8,
      trend: "up",
      recentErrors: 3,
      borderClass: "border-emerald-500",
      bgClass: "bg-emerald-100",
    },
    {
      name: "Integration",
      score: 72,
      solved: 38,
      toMaster: 15,
      trend: "up",
      recentErrors: 7,
      borderClass: "border-amber-500",
      bgClass: "bg-amber-100",
    },
    {
      name: "Trigonometry",
      score: 90,
      solved: 52,
      toMaster: 3,
      trend: "stable",
      recentErrors: 1,
      borderClass: "border-emerald-500",
      bgClass: "bg-emerald-100",
    },
    {
      name: "Algebra",
      score: 65,
      solved: 31,
      toMaster: 18,
      trend: "down",
      recentErrors: 12,
      borderClass: "border-rose-500",
      bgClass: "bg-rose-100",
    },
    {
      name: "Statistics",
      score: 78,
      solved: 42,
      toMaster: 11,
      trend: "up",
      recentErrors: 5,
      borderClass: "border-amber-500",
      bgClass: "bg-amber-100",
    },
    {
      name: "Mechanics",
      score: 58,
      solved: 25,
      toMaster: 22,
      trend: "down",
      recentErrors: 15,
      borderClass: "border-rose-500",
      bgClass: "bg-rose-100",
    },
  ];

  // Get weak topics for AI recommendations
  const weakTopics = mathTopics
    .filter(t => t.score < 75)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  // Mock streak data - you'll replace this with real data from your database
  const streakDays = 7;
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const completedDays = [true, true, true, true, true, true, true]; // Last 7 days

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  return (
    <main className='w-full min-h-screen flex flex-col md:flex-row bg-white overflow-x-hidden'>
      {/* Sidebar */}
      <div className="w-fit 2xl:w-[15%] h-screen hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />
      
      <div className='flex flex-col lg:flex-row w-full min-h-screen lg:h-screen min-w-0 overflow-auto lg:overflow-hidden'>
        {/* Main Content Area */}
        <div className='flex-1 p-6 w-full lg:w-[75%] xl:w-[80%] min-w-0 lg:overflow-y-auto scrollbar-hide lg:h-full'>
          {/* Header */}
          <p className='text-2xl font-bold'>Dashboard</p>
          <p className='text-slate-400 text-[14px] xl:text-lg'>
            Welcome back, {data.user.email.split('@')[0]}! Let's continue your A-Level Maths journey 🎯
          </p>

          {/* Action Cards */}
          <div className='flex flex-col w-full gap-3 pt-5'>
            <div className='flex flex-col lg:flex-row gap-4 w-full'>
              <Link 
                href={"/dashboard/solve"} 
                className='group w-full lg:w-1/3 flex flex-col justify-between border border-green-500 bg-green-300 hover:bg-green-400 transition-all duration-200 rounded-xl p-5'
              >
                <div className='flex flex-row justify-between items-center'>
                  <p className='font-semibold text-lg'>Solve Question</p>
                  <FaArrowRight className='bg-white p-2 rounded-full w-8 h-8 text-green-500 group-hover:text-green-400 transition-all duration-200'/>
                </div>
                <p className='text-sm text-green-800 mt-2'>Get instant help with any problem</p>
              </Link>
              
              <Link 
                href={"/dashboard/worksheet"} 
                className='group w-full lg:w-1/3 flex flex-col justify-between border border-blue-500 bg-blue-300 hover:bg-blue-400 transition-all duration-200 rounded-xl p-5'
              >
                <div className='flex flex-row justify-between items-center'>
                  <p className='font-semibold text-lg'>Generate Practice</p>
                  <FaFileAlt className='bg-white p-2 rounded-full w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-all duration-200'/>
                </div>
                <p className='text-sm text-blue-800 mt-2'>Smart worksheets for weak topics</p>
              </Link>
              
              <Link 
                href={"/dashboard/deepwork"} 
                className='group w-full lg:w-1/3 flex flex-col justify-between border border-amber-500 bg-amber-300 hover:bg-amber-400 transition-all duration-200 rounded-xl p-5'
              >
                <div className='flex flex-row justify-between items-center'>
                  <p className='font-semibold text-lg'>Start Deep Work</p>
                  <FaCentos className='bg-white p-2 rounded-full w-8 h-8 text-amber-500 group-hover:text-amber-400 transition-all duration-200'/>
                </div>
                <p className='text-sm text-amber-800 mt-2'>45 min focus session ready</p>
              </Link>
            </div>

            {/* AI Recommendations Section - NEW */}
            {weakTopics.length > 0 && (
              <div className='bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 mt-5'>
                <div className='flex flex-col lg:flex-row items-start gap-4'>
                  <div className='bg-indigo-600 p-3 rounded-lg flex-shrink-0'>
                    <FaBullseye className='text-white text-2xl' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-xl font-bold text-gray-900 mb-3'>📌 AI Recommendations for This Week</h3>
                    <div className='space-y-3'>
                      {weakTopics.map((topic, idx) => (
                        <div key={idx} className='flex flex-col lg:flex-row items-start lg:items-center justify-between bg-white rounded-lg p-4 border border-indigo-100 gap-3'>
                          <div className='flex-1'>
                            <div className='flex flex-wrap items-center gap-3 mb-1'>
                              <span className='font-semibold text-gray-900'>{topic.name}</span>
                              <span className={`text-sm px-2 py-1 rounded ${topic.bgClass} ${topic.borderClass} border`}>
                                {topic.score}% mastery
                              </span>
                            </div>
                            <p className='text-sm text-gray-600'>
                              {topic.recentErrors} recent errors • {topic.toMaster} questions to master
                            </p>
                          </div>
                          <Link 
                            href={`/dashboard/practice?topic=${topic.name}`}
                            className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm whitespace-nowrap'
                          >
                            Practice Now
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Topic Mastery */}
            <div className="flex flex-col w-full min-w-0 pt-5">
              <p className="text-2xl font-bold">Topic Mastery</p>
              <p className="text-[14px] xl:text-lg pb-5 text-slate-400">
                Your progress across A-Level Maths topics
              </p>

              {mathTopics.length === 0 ? (
                <div className="flex flex-col gap-4 rounded-xl items-center justify-center h-48 w-72 border border-gray-400 bg-gray-200 p-6 text-center">
                  <p className="text-xl font-semibold">No topics yet</p>
                  <p className="text-sm">
                    Ask the tutorAI questions to start tracking your topic mastery.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full bg-slate-100 p-4 rounded-xl">
                  <div className="flex gap-4 flex-nowrap min-w-0">
                    {mathTopics.map((topic) => (
                      <div key={topic.name} className="flex-shrink-0">
                        <div className={`border-2 rounded-xl p-5 ${topic.bgClass} ${topic.borderClass} hover:shadow-md transition-shadow cursor-pointer min-w-[180px]`}>
                          <div className='flex items-start justify-between mb-3'>
                            <h4 className='font-bold text-gray-900'>{topic.name}</h4>
                            <div className={`p-1 rounded ${
                              topic.trend === 'up' ? 'bg-emerald-200' : 
                              topic.trend === 'down' ? 'bg-rose-200' : 
                              'bg-gray-200'
                            }`}>
                              {topic.trend === 'up' ? (
                                <FaArrowUp className='text-emerald-700' size={16} />
                              ) : topic.trend === 'down' ? (
                                <FaArrowDown className='text-rose-700' size={16} />
                              ) : (
                                <span className='text-gray-600'>—</span>
                              )}
                            </div>
                          </div>
                          <div className={`text-4xl font-bold mb-3 ${
                            topic.score >= 80 ? 'text-emerald-700' :
                            topic.score >= 60 ? 'text-amber-700' :
                            'text-rose-700'
                          }`}>
                            {topic.score}%
                          </div>
                          <div className='space-y-1 text-sm text-gray-700'>
                            <p>{topic.solved} questions solved</p>
                            <p className='font-medium'>{topic.toMaster} more to master</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className='flex flex-col w-full pt-5'>
              <p className='text-2xl font-bold'>Recent Activity</p>
              <div className='py-4'>
                <PastActivitiesTable />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className='flex flex-col gap-4 w-full lg:w-[25%] xl:w-[20%] bg-violet-300 items-center px-3 py-4 2xl:px-8 lg:overflow-y-auto scrollbar-hide lg:h-full'>
          {/* User Profile */}
          <p><FaUser className='bg-white text-black w-14 h-14 p-2 rounded-full'/></p>
          <p className='text-2xl font-bold'>{data.user.email.split('@')[0]}</p>
          <p className='text-md text-slate-700'>Free plan</p>
          <div className='block border-b border-slate-400 px-4 w-full py-2'></div>
          
          <Link 
            href={"/dashboard/settings"} 
            className='mt-2 px-10 py-2 border-2 border-violet-700 rounded-2xl text-violet-600 hover:cursor-pointer hover:bg-violet-700 hover:text-white transition-all duration-200 text-center'
          >
            Edit Plan
          </Link>
          <div className='px-10 py-2 border-2 border-red-700 rounded-2xl text-red-600 hover:cursor-pointer hover:bg-red-700 hover:text-white transition-all duration-200'>
            Log Out
          </div>
          
          <div className='block border-b border-slate-400 px-4 w-full py-2'></div>

          {/* Enhanced Streak Section */}
          <div className='border border-violet-400 bg-violet-200 w-full rounded-xl p-5'>
            <div className="flex flex-col gap-2 w-full items-center justify-center">
              <div className='bg-gradient-to-br from-orange-400 to-red-500 rounded-full p-4 mb-2'>
                <FaFire className='text-white text-4xl' />
              </div>
              <p className="text-[60px] lg:text-[80px] -mb-2 font-bold bg-gradient-to-b from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                {streakDays}
              </p>
              <p className="text-[20px] text-orange-500 lg:text-[24px] font-medium">
                Day Streak 🔥
              </p>
              <p className='text-slate-600 pt-2 text-sm text-center'>Consistency is key to success!</p>
              
              {/* Mini Calendar */}
              <div className='flex justify-center gap-1 mt-4 mb-2'>
                {weekDays.map((day, idx) => (
                  <div key={idx} className='flex flex-col items-center'>
                    <div className='text-xs text-slate-600 mb-1'>{day}</div>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      completedDays[idx] ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}>
                      {completedDays[idx] && <FaCheck className='text-white text-xs' />}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className='bg-violet-300 rounded-lg p-3 text-center mt-2 w-full'>
                <p className='text-xs text-slate-700'>Complete today's session to maintain your streak!</p>
              </div>
            </div>
          </div>

          {/* Learning Path - NEW */}
          <div className='border border-violet-400 bg-violet-200 w-full rounded-xl p-5'>
            <h3 className='text-lg font-bold text-gray-900 mb-2'>Your Learning Path</h3>
            <p className='text-sm text-slate-700 mb-4'>A-Level Maths curriculum</p>
            
            <div className='space-y-3'>
              {[
                { topic: 'Quadratic Equations', status: 'completed', week: 1 },
                { topic: 'Differentiation Basics', status: 'completed', week: 2 },
                { topic: 'Integration Techniques', status: 'current', week: 3 },
                { topic: 'Trigonometric Functions', status: 'upcoming', week: 4 },
                { topic: 'Vectors', status: 'upcoming', week: 5 }
              ].map((item, idx) => (
                <div key={idx} className='flex items-center gap-3'>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.status === 'completed' ? 'bg-emerald-500' :
                    item.status === 'current' ? 'bg-indigo-600' :
                    'bg-gray-300'
                  }`}>
                    {item.status === 'completed' ? (
                      <FaCheck className='text-white text-sm' />
                    ) : (
                      <span className='text-sm font-bold text-white'>{item.week}</span>
                    )}
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium text-gray-900 text-sm'>{item.topic}</div>
                    <div className='text-xs text-slate-600'>Week {item.week}</div>
                  </div>
                  {item.status === 'current' && (
                    <span className='text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded'>Current</span>
                  )}
                </div>
              ))}
            </div>
            
            <Link 
              href='/dashboard/curriculum'
              className='w-full mt-4 px-4 py-2 bg-violet-400 text-slate-800 rounded-lg hover:bg-violet-500 font-medium text-sm text-center block'
            >
              View Full Curriculum
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}