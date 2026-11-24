import { AdminShell } from "@/components/AdminShell"; import { requireAdmin } from "@/lib/supabase-server"; import { createMedia,deleteRecord } from "@/app/admin/actions"; import Image from "next/image"; import { redirect } from "next/navigation";
export const dynamic="force-dynamic";
export default async function AdminGallery({searchParams}:{searchParams:Promise<{saved?:string;error?:string}>}){const [{supabase,profile},params]=await Promise.all([requireAdmin(),searchParams]);if(!supabase||!profile)redirect("/admin?error=unauthorized");const {data:rows,error}=await supabase.from("media").select("id,title,file_url,alt_text,category,created_at").order("created_at",{ascending:false});return <AdminShell><main className="admin-main"><div className="admin-title"><div><h1>Media Gallery</h1><p>Manage approved SSLTA event photography and media records.</p></div></div>{params.saved&&<p className="form-success">Media record saved.</p>}{params.error&&<p className="form-error">Unable to save media record.</p>}<div className="admin-panel"><h3>Add media record</h3><p>Upload the image to Supabase Storage or another approved image host, then enter its public URL here.</p>
{/* <form action={createMedia} className="admin-form"><input name="title" placeholder="Media title"/>
<input name="file_url" type="url" placeholder="Public image URL" required/>
<input name="alt_text" placeholder="Alternative text"/>
<input name="category" placeholder="Category (event, junior, coaching...)"/>
<button className="btn btn-primary">Save media</button></form> */}



<form
  action={createMedia}
  className="admin-form"
  encType="multipart/form-data"
>
  <input
    name="title"
    placeholder="Media title"
    required
  />

  <input
    name="image"
    type="file"
    accept="image/jpeg,image/png,image/webp"
    required
  />

  <input
    name="alt_text"
    placeholder="Alternative text"
  />

  <input
    name="category"
    placeholder="Category: event, junior, coaching..."
  />

  <input name="alt_text" placeholder="Alternative text"/>
<input name="category" placeholder="Category (event, junior, coaching...)"/>

  <button className="btn btn-primary" type="submit">
    Upload media
  </button>
</form>

</div>{error?<p className="form-error">{error.message}</p>:<div className="admin-panel"><h3>Media records ({rows?.length??0})</h3><div className="gallery">{rows?.map((m:any)=><div className="media-admin-card" key={m.id}>{m.file_url.startsWith("/")?<Image src={m.file_url} alt={m.alt_text||m.title||"SSLTA media"} width={500} height={350}/>:<img src={m.file_url} alt={m.alt_text||m.title||"SSLTA media"}/>}<b>{m.title||"Untitled media"}</b><form action={deleteRecord}><input type="hidden" name="table" value="media"/><input type="hidden" name="id" value={m.id}/><button className="btn btn-danger">Delete</button></form></div>)}</div>{!rows?.length&&<p>No media records yet.</p>}</div>}</main></AdminShell>}
