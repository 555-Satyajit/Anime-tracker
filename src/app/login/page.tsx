"use client"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh pb-20 lg:pb-0 lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex flex-col">
            <div className="text-3xl font-black text-white tracking-widest leading-none mb-1">
              SENKA<span className="text-[#e71014]">I</span>
            </div>
            <div className="text-[10px] text-[#888] font-medium tracking-[0.2em] uppercase pl-1">
              Your Anime Journey
            </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7]"
        />
      </div>
    </div>
  )
}
