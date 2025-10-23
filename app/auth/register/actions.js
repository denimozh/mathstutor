'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData) {
  const supabase = await createClient()
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const { error, user } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message }
  }

  // Optionally, sign in immediately if no email confirmation is required
  if (!user) {
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) return { error: signInError.message }
  }

  // revalidate home/dashboard
  revalidatePath('/', 'layout')

  return { success: true }
}
