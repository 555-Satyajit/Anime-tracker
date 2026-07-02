'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  'confirm-password': z.string()
}).refine((data) => data.password === data['confirm-password'], {
  message: "Passwords do not match.",
  path: ["confirm-password"],
})

export type FormState = {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    'confirm-password'?: string[]
    _form?: string[]
  }
} | null

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validatedFields = loginSchema.safeParse({ email, password })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  })

  if (error) {
    return {
      errors: {
        _form: [error.message || "Could not authenticate user."]
      }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/Tracker')
}

export async function signup(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm-password') as string

  const validatedFields = signupSchema.safeParse({
    name,
    email,
    password,
    'confirm-password': confirmPassword,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      data: {
        full_name: validatedFields.data.name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    }
  })

  if (error) {
    return {
      errors: {
        _form: [error.message || "Could not create user."]
      }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/Tracker')
}

export async function loginWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (data?.url) {
    redirect(data.url)
  }
}
