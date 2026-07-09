"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createClan(
  name: string,
  description: string,
  isPrivate: boolean = false,
  mascotName?: string,
  mascotImage?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in to create a clan." };

  const { data: clan, error: clanError } = await supabase
    .from("clans")
    .insert({
      name,
      description,
      is_private: isPrivate,
      mascot_name: mascotName,
      mascot_image: mascotImage,
      leader_id: user.id
    })
    .select()
    .single();

  if (clanError) {
    console.error("Error creating clan:", clanError);
    return { error: clanError.message };
  }

  // The creator is automatically added as a Leader in the clan_members table
  const { error: memberError } = await supabase
    .from("clan_members")
    .insert({
      clan_id: clan.id,
      user_id: user.id,
      role: 'Leader'
    });

  if (memberError) {
    console.error("Error adding clan leader:", memberError);
    return { error: memberError.message };
  }

  revalidatePath("/Community/clans");
  return { success: true, clanId: clan.id };
}

export async function joinClan(clanId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  // SECURITY CHECK: Verify clan is public
  const { data: clan, error: clanError } = await supabase
    .from("clans")
    .select("is_private")
    .eq("id", clanId)
    .single();

  if (clanError || !clan) {
    return { error: "Clan not found" };
  }

  if (clan.is_private) {
    return { error: "Cannot join a private clan directly. You must apply." };
  }

  const { error } = await supabase
    .from("clan_members")
    .insert({
      clan_id: clanId,
      user_id: user.id,
      role: 'Member'
    });

  if (error) {
    console.error("Error joining clan:", error);
    return { error: error.message };
  }

  revalidatePath(`/Community/clans`);
  revalidatePath(`/Community/clans/${clanId}`);
  return { success: true };
}

export async function leaveClan(clanId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  // Cannot leave if leader, must transfer ownership or delete clan (simplify for MVP)
  const { data: clan } = await supabase.from("clans").select("leader_id").eq("id", clanId).single();
  if (clan?.leader_id === user.id) {
    return { error: "Leader cannot leave clan. You must delete the clan instead." };
  }

  const { error } = await supabase
    .from("clan_members")
    .delete()
    .match({ clan_id: clanId, user_id: user.id });

  if (error) {
    console.error("Error leaving clan:", error);
    return { error: error.message };
  }

  revalidatePath(`/Community/clans`);
  revalidatePath(`/Community/clans/${clanId}`);
  return { success: true };
}

export async function applyToClan(clanId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  // Insert the request
  const { error: requestError } = await supabase
    .from("clan_requests")
    .insert({
      clan_id: clanId,
      user_id: user.id,
      status: "pending"
    });

  if (requestError) {
    console.error("Error applying to clan:", requestError);
    return { error: requestError.message };
  }

  // Fetch the leader
  const { data: clan } = await supabase.from("clans").select("leader_id, name").eq("id", clanId).single();
  const adminSupabase = createAdminClient();

  if (clan?.leader_id) {
    await adminSupabase.from("notifications").insert({
      user_id: clan.leader_id,
      title: "New Clan Request",
      message: `Someone wants to join your clan: ${clan.name}.`,
      link_url: `/Community/clans/${clanId}?tab=requests`,
      type: "system"
    });
  }

  if (clan?.name) {
    await adminSupabase.from("notifications").insert({
      user_id: user.id,
      title: "Clan Request Sent",
      message: `Your request to join ${clan.name} has been sent and is pending approval.`,
      link_url: `/Community/clans/${clanId}`,
      type: "system"
    });
  }

  revalidatePath(`/Community/clans`);
  revalidatePath(`/Community/clans/${clanId}`);
  return { success: true };
}

export async function approveClanRequest(requestId: string, clanId: string, applicantId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { data: clan } = await supabase.from("clans").select("leader_id, name").eq("id", clanId).single();
  if (clan?.leader_id !== user.id) return { error: "Not authorized" };

  const { error: updateError } = await supabase
    .from("clan_requests")
    .update({ status: 'approved' })
    .eq('id', requestId);

  if (updateError) return { error: updateError.message };

  const adminSupabase = createAdminClient();
  
  const { error: memberError } = await adminSupabase
    .from("clan_members")
    .insert({
      clan_id: clanId,
      user_id: applicantId,
      role: 'Member'
    });

  if (memberError) return { error: memberError.message };

  await adminSupabase.from("notifications").insert({
    user_id: applicantId,
    title: "Application Approved",
    message: `Your request to join ${clan.name} was approved!`,
    link_url: `/Community/clans/${clanId}`,
    type: "system"
  });

  revalidatePath(`/Community/clans/${clanId}`);
  return { success: true };
}

export async function rejectClanRequest(requestId: string, clanId: string, applicantId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { data: clan } = await supabase.from("clans").select("leader_id, name").eq("id", clanId).single();
  if (clan?.leader_id !== user.id) return { error: "Not authorized" };

  const { error: updateError } = await supabase
    .from("clan_requests")
    .update({ status: 'rejected' })
    .eq('id', requestId);

  if (updateError) return { error: updateError.message };

  const adminSupabase = createAdminClient();
  await adminSupabase.from("notifications").insert({
    user_id: applicantId,
    title: "Application Rejected",
    message: `Your request to join ${clan.name} was rejected.`,
    link_url: `/Community/clans`,
    type: "system"
  });

  revalidatePath(`/Community/clans/${clanId}`);
  return { success: true };
}

export async function deleteClan(clanId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { data: clan } = await supabase.from("clans").select("leader_id").eq("id", clanId).single();
  if (clan?.leader_id !== user.id) return { error: "Not authorized" };

  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase.from("clans").delete().eq("id", clanId);
  
  if (error) return { error: error.message };

  revalidatePath("/Community");
  revalidatePath("/Community/clans");
  return { success: true };
}

export async function updateClan(clanId: string, data: { name?: string, description?: string, mascot_name?: string, is_private?: boolean }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { data: clan } = await supabase.from("clans").select("leader_id").eq("id", clanId).single();
  if (clan?.leader_id !== user.id) return { error: "Not authorized" };

  const { error } = await supabase.from("clans").update(data).eq("id", clanId);

  if (error) return { error: error.message };

  revalidatePath(`/Community/clans/${clanId}`);
  revalidatePath("/Community/clans");
  return { success: true };
}
