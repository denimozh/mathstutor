"use client";
import { signup } from './actions'
import Link from 'next/link'
import React from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Page = () => {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)

    if (result.error) {
      if (result.error.toLowerCase().includes('email is not confirmed')) {
        toast.warning('Please verify your email before logging in.')
      } else {
        toast.error(result.error)
      }
    } else {
      toast.success('Signup successful!')
      window.location.href = '/dashboard'
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-sm md:w-md lg:w-lg text-center bg-white rounded-xl p-8 shadow-md'>
        <p className='text-3xl font-bold'>Register</p>
        <p className='text-lg text-slate-600'>Enter your account details to continue</p>
        <div className='flex flex-col gap-5 lg:pt-4 pb-5'>
          <input id="email" name="email" type="email" required className='h-13 focus:outline-none border border-slate-200 pl-4' placeholder='Email'/>
          <input id="password" name="password" type="password" className='h-13 focus:outline-none border border-slate-200 pl-4' placeholder='Password'/>
        </div>
        <button type="submit" className='h-13 bg-blue-400 border hover:bg-blue-600 text-white cursor-pointer '>Sign Up</button>
        <div className='flex flex-col gap-3'>
          <Link href={"/auth/login"} className='text-md text-blue-500 underline'>Already have an account?</Link>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  )
}

export default Page
