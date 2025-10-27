import Bottombar from '@/app/components/Bottombar'
import Sidebar from '@/app/components/Sidebar'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-screen flex flex-row bg-white'>
      <div className="w-fit 2xl:w-[15%] h-full hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />
      <div className='flex flex-col w-full h-full min-w-0  gap-5'>
        <p>History</p>
      </div>
    </div>
  )
}

export default page