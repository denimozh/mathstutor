import Bottombar from '@/app/components/Bottombar'
import Sidebar from '@/app/components/Sidebar'
import { createClient } from '@/utils/supabase/server';
import React from 'react'

export default async function Page() {
  const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
  
    if (error || !data?.user) {
      redirect('/login');
    }
  
  return (
    <div className='w-full h-screen flex flex-row bg-white'>
      <div className="w-fit 2xl:w-[15%] h-full hidden md:block">
        <Sidebar />
      </div>
      <Bottombar />
      <div className='flex flex-col w-full h-full min-w-0 gap-5 p-12'>
        <p>Worksheet Specific</p>
      </div>
    </div>
  )
}