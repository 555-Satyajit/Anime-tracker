import React from "react";
import { EditProfileForm } from "@/components/account/EditProfileForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="w-full flex flex-col">
      {/* Mobile Back Button & Header */}
      <div className="lg:hidden flex items-center gap-4 mb-8">
        <Link href="/account" className="text-[#888] hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-white">Edit Profile</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Edit Your Profile</h1>
        <p className="text-sm text-[#888]">Manage your account information and profile settings.</p>
        <div className="w-full h-px bg-white/10 mt-6" />
      </div>

      <EditProfileForm user={user} initialProfile={profile || {}} />
    </div>
  );
}
