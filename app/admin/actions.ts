"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase-server";

const v = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
async function adminClient(allowedRoles = ["super_admin", "admin", "editor", "staff", "tournament_official"]) {
  const auth = await requireAdmin();
  if (!auth.supabase || !auth.profile || !allowedRoles.includes(auth.profile.role)) redirect("/admin?error=unauthorized");
  return auth.supabase;
}

export async function createPlayer(fd: FormData) {
  const db = await adminClient(["super_admin", "admin"]);
  const full_name=v(fd,"full_name"), category=v(fd,"category");
  if (!full_name || !category) redirect("/admin/players?error=required");
  const { error } = await db.from("players").insert({ full_name, category, gender:v(fd,"gender") || null, nationality:v(fd,"nationality") || "South Sudan", status:"active" });
  if (error) redirect("/admin/players?error=save");
  revalidatePath("/admin/players"); revalidatePath("/players"); revalidatePath("/"); redirect("/admin/players?saved=1");
}
export async function createClub(fd: FormData) {
  const db=await adminClient(["super_admin", "admin"]); const name=v(fd,"name");
  if (!name) redirect("/admin/clubs?error=required");
  const {error}=await db.from("clubs").insert({name,location:v(fd,"location")||null,contact_name:v(fd,"contact_name")||null,contact_email:v(fd,"contact_email")||null,phone:v(fd,"phone")||null,court_count:Number(v(fd,"court_count")||0)});
  if(error) redirect("/admin/clubs?error=save");
  revalidatePath("/admin/clubs"); revalidatePath("/"); redirect("/admin/clubs?saved=1");
}
export async function createTournament(fd: FormData) {
  const db=await adminClient(["super_admin", "admin", "tournament_official"]); const name=v(fd,"name"), category=v(fd,"category");
  if(!name||!category) redirect("/admin/tournaments?error=required");
  const {data:{user}}=await db.auth.getUser();
  const {error}=await db.from("tournaments").insert({name,category,description:v(fd,"description")||null,venue:v(fd,"venue")||null,start_date:v(fd,"start_date")||null,end_date:v(fd,"end_date")||null,status:v(fd,"status")||"draft",registration_open:v(fd,"registration_open")==="on",created_by:user?.id||null});
  if(error) redirect("/admin/tournaments?error=save");
  revalidatePath("/admin/tournaments"); revalidatePath("/tournaments"); revalidatePath("/"); redirect("/admin/tournaments?saved=1");
}
export async function createNews(fd: FormData) {
  const db=await adminClient(["super_admin", "admin", "editor"]); const title=v(fd,"title"), slug=v(fd,"slug")||title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  if(!title) redirect("/admin/news?error=required");
  const {data:{user}}=await db.auth.getUser();
  const status=v(fd,"status")||"draft";
  const {error}=await db.from("news").insert({title,slug,excerpt:v(fd,"excerpt")||null,body:v(fd,"body")||null,cover_url:v(fd,"cover_url")||null,status,published_at:status==="published"?new Date().toISOString():null,author_id:user?.id||null});
  if(error) redirect("/admin/news?error=save");
  revalidatePath("/admin/news"); revalidatePath("/news"); revalidatePath("/"); redirect("/admin/news?saved=1");
}
export async function createMedia(fd: FormData) {
  const db=await adminClient(["super_admin", "admin", "editor"]); const file_url=v(fd,"file_url");
  if(!file_url) redirect("/admin/gallery?error=required");
  const {data:{user}}=await db.auth.getUser();
  const {error}=await db.from("media").insert({title:v(fd,"title")||null,file_url,alt_text:v(fd,"alt_text")||null,category:v(fd,"category")||"event",uploaded_by:user?.id||null});
  if(error) redirect("/admin/gallery?error=save");
  revalidatePath("/admin/gallery"); revalidatePath("/gallery"); redirect("/admin/gallery?saved=1");
}
export async function deleteRecord(fd: FormData) {
  const db=await adminClient(["super_admin", "admin"]);
  const table=v(fd,"table"), id=v(fd,"id");
  const allowed=["players","clubs","tournaments","news","media"];
  if(!allowed.includes(table)||!id) redirect("/admin/dashboard?error=invalid");
  const {error}=await db.from(table).delete().eq("id",id);
  if(error) redirect(`/admin/${table}?error=delete`);
  revalidatePath(`/admin/${table}`); revalidatePath("/"); redirect(`/admin/${table}?deleted=1`);
}

export async function updateApplicationStatus(fd: FormData) {
  const db=await adminClient(["super_admin", "admin", "staff"]); const id=v(fd,"id"), status=v(fd,"status");
  if(!id||!["pending","under_review","approved","rejected"].includes(status)) redirect("/admin/applications?error=invalid");
  const {data:{user}}=await db.auth.getUser();
  const {error}=await db.from("membership_applications").update({status,reviewed_by:user?.id||null,reviewed_at:new Date().toISOString()}).eq("id",id);
  if(error) redirect("/admin/applications?error=save");
  revalidatePath("/admin/applications"); revalidatePath("/admin/dashboard"); redirect("/admin/applications?saved=1");
}
export async function updateEnquiryStatus(fd: FormData) {
  const db=await adminClient(["super_admin", "admin", "staff"]); const id=v(fd,"id"), status=v(fd,"status");
  if(!id||!["new","in_progress","resolved","closed"].includes(status)) redirect("/admin/enquiries?error=invalid");
  const {data:{user}}=await db.auth.getUser();
  const {error}=await db.from("contact_enquiries").update({status,assigned_to:user?.id||null}).eq("id",id);
  if(error) redirect("/admin/enquiries?error=save");
  revalidatePath("/admin/enquiries"); revalidatePath("/admin/dashboard"); redirect("/admin/enquiries?saved=1");
}

export async function updatePlayerRanking(fd: FormData) {
  const db=await adminClient(["super_admin", "admin"]); const id=v(fd,"id");
  const rawPosition=v(fd,"ranking_position"), rawPoints=v(fd,"ranking_points");
  const ranking_position=rawPosition?Number(rawPosition):null;
  const ranking_points=rawPoints?Number(rawPoints):0;
  if(!id||(ranking_position!==null&&(!Number.isInteger(ranking_position)||ranking_position<1))||!Number.isInteger(ranking_points)||ranking_points<0) redirect("/admin/rankings?error=invalid");
  const {error}=await db.from("players").update({ranking_position,ranking_points}).eq("id",id);
  if(error) redirect("/admin/rankings?error=save");
  revalidatePath("/admin/rankings"); revalidatePath("/rankings"); revalidatePath("/"); redirect("/admin/rankings?saved=1");
}
