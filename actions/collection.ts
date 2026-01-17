'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleCollection(playerId: number, rarity: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: existing } = await supabase
    .from('user_collections')
    .select('id')
    .eq('user_id', user.id)
    .eq('player_id', playerId)
    .single();

  if (existing) {
    await supabase.from('user_collections').delete().eq('id', existing.id);
    revalidatePath('/players');
    revalidatePath('/collection');
    return { action: 'removed' };
  } else {
    await supabase.from('user_collections').insert({
      user_id: user.id,
      player_id: playerId,
      assigned_rarity: rarity
    });
    revalidatePath('/players');
    revalidatePath('/collection');
    return { action: 'added' };
  }
}