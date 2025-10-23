"use client";
import Link from 'next/link'
import React from 'react'
import { login } from './actions'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Page = () => {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const result = await login(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Login successful!')
      // redirect to dashboard/home
      window.location.href = '/dashboard'
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-sm md:w-md lg:w-lg text-center bg-white rounded-xl p-8 shadow-md'>
        <p className='text-3xl font-bold'>Log In</p>
        <p className='text-lg text-slate-600'>Enter your credentials to continue</p>
        <div className='flex flex-col gap-5 lg:pt-4'>
          <input id="email" name="email" type="email" required className='h-13 focus:outline-none border border-slate-200 pl-4' placeholder='Email'/>
          <input id="password" name="password" type="password" required className='h-13 focus:outline-none border border-slate-200 pl-4' placeholder='Password'/>
        </div>
        <button type="submit" className='h-13 bg-blue-400 border hover:bg-blue-600 text-white cursor-pointer'>Login</button>
        <div className='flex flex-col gap-3'>
          <p className='text-md text-slate-400'>Forgot your <Link href={"/auth/reset-password"} className='text-blue-500 hover:text-blue-600'>password?</Link></p>
          <Link href={"/auth/register"} className='text-md text-blue-500 underline'>Don't have an account?</Link>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  )
}

export default Page
