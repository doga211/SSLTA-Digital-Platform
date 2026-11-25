import { createServerSupabase } from "@/lib/supabase-server";

export async function getDashboardData() {
  const supabase = await createServerSupabase();
  if (!supabase) return { connected:false, schemaReady:false, players:0, clubs:0, tournaments:0, publishedNews:0, rankingCategories:0, applications:0, enquiries:0, recentPlayers:[], recentTournaments:[], recentNews:[] };
  const [players,clubs,tournaments,publishedNews,categories,applications,enquiries,recentPlayers,recentTournaments,recentNews] = await Promise.all([
    supabase.from("players").select("id",{count:"exact",head:true}),
    supabase.from("clubs").select("id",{count:"exact",head:true}),
    supabase.from("tournaments").select("id",{count:"exact",head:true}),
    supabase.from("news").select("id",{count:"exact",head:true}).eq("status","published"),
    supabase.from("players").select("category"),
    supabase.from("membership_applications").select("id",{count:"exact",head:true}).eq("status","pending"),
    supabase.from("contact_enquiries").select("id",{count:"exact",head:true}).eq("status","new"),
    supabase.from("players").select("id,full_name,category,status,created_at").order("created_at",{ascending:false}).limit(5),
    supabase.from("tournaments").select("id,name,category,status,start_date,venue").order("created_at",{ascending:false}).limit(5),
    supabase.from("news").select("id,title,status,published_at").order("created_at",{ascending:false}).limit(5),
  ]);
  const uniqueCategories = new Set((categories.data ?? []).map((row:any)=>row.category).filter(Boolean));
  return {
    connected:true, schemaReady:![players,clubs,tournaments,publishedNews,categories,applications,enquiries].some((result:any)=>result.error), players:players.count??0, clubs:clubs.count??0, tournaments:tournaments.count??0,
    publishedNews:publishedNews.count??0, rankingCategories:uniqueCategories.size,
    applications:applications.count??0, enquiries:enquiries.count??0,
    recentPlayers:recentPlayers.data??[], recentTournaments:recentTournaments.data??[], recentNews:recentNews.data??[],
  };
}

export async function getPublicHomeData() {
  const supabase = await createServerSupabase();
  if (!supabase) return { connected:false, schemaReady:false, players:0, clubs:0, tournaments:[], rankings:[], news:[] };
  const [players,clubs,tournaments,rankings,news] = await Promise.all([
    supabase.from("players").select("id",{count:"exact",head:true}).eq("status","active"),
    supabase.from("clubs").select("id",{count:"exact",head:true}).eq("verified",true),
    supabase.from("tournaments").select("id,name,category,status,start_date,venue").neq("status","draft").order("start_date",{ascending:true}).limit(3),
    supabase.from("players").select("id,full_name,category,ranking_position,ranking_points").eq("status","active").not("ranking_position","is",null).order("ranking_position",{ascending:true}).limit(5),
    supabase.from("news").select("id,title,excerpt,cover_url,published_at").eq("status","published").order("published_at",{ascending:false}).limit(3),
  ]);
  return { connected:true, schemaReady:![players,clubs,tournaments,rankings,news].some((result:any)=>result.error), players:players.count??0, clubs:clubs.count??0, tournaments:tournaments.data??[], rankings:rankings.data??[], news:news.data??[] };
}
