import Bottombar from '@/app/components/Bottombar'
import QuestionInput from '@/app/components/QuestionInput'
import Sidebar from '@/app/components/Sidebar'
import React from 'react'

const Page = () => {
  return (
    <div className='w-full min-h-screen flex flex-row bg-gradient-to-br from-slate-50 via-violet-50 to-slate-50'>
      {/* Sidebar - Fixed to full height */}
      <div className="w-fit 2xl:w-[15%] hidden md:block sticky top-0 h-screen">
        <Sidebar />
      </div>
      
      {/* Mobile Bottom Bar */}
      <Bottombar />
      
      {/* Main Content */}
      <div className='flex flex-col w-full min-h-screen min-w-0 items-center justify-start py-8 lg:py-16 px-4 lg:px-8'>
        <div className='w-full max-w-5xl'>
          {/* Header Section */}
          <div className='bg-white/80 backdrop-blur-sm p-6 lg:py-10 lg:px-12 rounded-3xl shadow-sm mb-8'>
            <h1 className='text-3xl lg:text-5xl font-bold text-center leading-tight'>
              Let's <span className='text-violet-500 bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent'>solve</span> anything together
            </h1>
            <p className='text-sm lg:text-lg text-slate-500 text-center pt-4 lg:pt-6 max-w-2xl mx-auto'>
              I provide you with step-by-step solutions with detailed explanations
            </p>
          </div>
          
          {/* Question Input Component */}
          <QuestionInput />
        </div>
      </div>
    </div>
  )
}

export default Page