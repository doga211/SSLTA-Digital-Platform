import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from "@supabase/ssr";


import { requireAdmin } from '@/lib/auth/require-admin'

const allowed = new Set(['scheduled','called','on_court','paused','completed','delayed','cancelled'])
export async function POST(request: Request) {
  try {
    const profile = await requireAdmin(['super_admin','admin','competition_manager','official','staff'])
    const body = await request.json(); const matchId=String(body.matchId??''); const liveStatus=String(body.liveStatus??'')
    if(!matchId || !allowed.has(liveStatus)) return NextResponse.json({error:'Valid matchId and liveStatus are required.'},{status:400})
    const supabase=await createClient(); if(!supabase) return NextResponse.json({error:'Supabase is not configured.'},{status:503})
    const now=new Date().toISOString(); const patch:any={live_status:liveStatus}
    if(liveStatus==='on_court') patch.started_at=now
    if(liveStatus==='completed') { patch.completed_at=now; patch.status='completed' }
    const {error}=await supabase.from('matches').update(patch).eq('id',matchId)
    if(error) return NextResponse.json({error:error.message},{status:400})
    await supabase.from('match_schedule').update({schedule_status:liveStatus==='on_court'?'on_court':liveStatus==='completed'?'completed':liveStatus,updated_by:profile.id,updated_at:now}).eq('match_id',matchId)
    return NextResponse.json({matchId,liveStatus})
  } catch(error:any){return NextResponse.json({error:error?.message??'Unable to update match status.'},{status:400})}
}
async function createClient() {
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_PUBLISHABLE_KEY

  if (!url || !key) return null

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Ignore cookie write errors in server actions/routes.
        }
      },
    },
  })
}
