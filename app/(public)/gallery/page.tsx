import Image from "next/image"; 
import { PageHero } from "@/components/PageHero"; 
import { createServerSupabase } from "@/lib/supabase-server";
export const dynamic="force-dynamic";
const eventPhotos=["/images/sslta-independence-day-2026.jpg",
    "/images/sslta-independence-day-2026-1.jpg",
    "/images/sslta-independence-day-2026-2.jpg",
   
    "/images/During coaching Training with smash Academy in 2022.jpg",
    "/images/SSLTA Coaching Training and Officials workshop.jpg",
    "/images/SSLTA and MTN SS TENNIS officiating and Coaching Workshop 1.jpg"
    ,"/images/SSLTA and MTN SS TENNIS officiating and Coaching Workshop 2.jpg",
    "/images/SSLTA and MTN SS TENNIS officiating and Coaching Workshop 3.jpg",

    "/images/SSLTA Inter School Tournaments .jpg",
    "/images/SSLTA Inter School Tournaments 2.jpg",
    "/images/SSLTA Inter School Tournaments 3.jpg",
        "/images/SSLTA Inter School Tournaments 4.jpg",
        "/images/SSLTA Inter School Tournaments 5.jpg",
        "/images/SSLTA Inter School Tournaments 6.jpg",
        "/images/SSLTA Inter School Tournaments 7.jpg",
        "/images/SSLTA Inter School Tournaments 8.jpg",
        "/images/SSLTA Inter School Tournaments 9.jpg",
        "/images/SSLTA Inter School Tournaments 10.jpg",
        "/images/SSLTA Inter School Tournaments 11.jpg",
        
        "/images/SSLTA Junior Training .jpg",
        "/images/SSLTA Junior Training 2.jpg",
        
        
        "/images/IMG-20261029-WA0012.jpg",
        
        "/images/IMG-20261029-WA0022.jpg",
        
        "/images/IMG-20261029-WA0017.jpg",
        
    "/images/sslta-event-1.jpg","/images/sslta-event-2.jpg","/images/sslta-event-3.jpg",
    "/images/sslta-event-4.jpg","/images/sslta-junior-1.jpg","/images/sslta-junior-2.jpg",
    "/images/sslta-coaching.jpg","/images/sslta-awards.jpg"];

export default async function Gallery(){const db=await createServerSupabase();const {data}=db?await db.from("media").select("id,title,file_url,alt_text").order("created_at",{ascending:false}):{data:[]};return <><PageHero eyebrow="Media" title="Life on and around the court" text="A visual record of SSLTA events, junior tennis, community participation and tournament moments."/><section className="section"><div className="container"><div className="gallery">{eventPhotos.map((src,i)=><div className="gallery-item" key={src}><Image src={src} alt={i===0?"SSLTA 2026 Independence Day Tournament":"SSLTA tennis moment"} width={700} height={500}/>{i===0&&<span>2026 Independence Day Tournament</span>}</div>)}{data?.map((m:any)=><div className="gallery-item" key={m.id}><img src={m.file_url} alt={m.alt_text||m.title||"SSLTA media"}/>{m.title&&<span>{m.title}</span>}</div>)}</div></div></section></>}



