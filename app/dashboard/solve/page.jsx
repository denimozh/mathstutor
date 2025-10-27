import Bottombar from '@/app/components/Bottombar'
import QuestionInput from '@/app/components/QuestionInput'
import Sidebar from '@/app/components/Sidebar'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-screen flex flex-row bg-white'>
      <div className="w-fit 2xl:w-[15%] h-full hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />
      <div className='flex flex-col w-full h-full min-w-0 items-center justify-center gap-5'>
        <div className='bg-slate-50 p-2 lg:py-8 lg:px-16 rounded-2xl'>
          <p className='text-4xl lg:text-5xl font-bold text-center'>Let's <span className='text-violet-500'>solve</span> anything together</p>
          <p className='text-[14px] lg:text-lg text-slate-400 text-center pt-5'>I provide you with step-by-step solution with explanations</p>
          <QuestionInput />
        </div>
      </div>
    </div>
  )
}

export default page