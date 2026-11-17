// import { NextResponse } from 'next/server'
// import { cookies } from 'next/headers'
// import { createServerClient as createSupabaseServerClient } from '@/lib/supabase/server'
// import { requireAdmin } from '@/lib/auth/require-admin'

// export async function POST(request: Request) {
//   try {
//     const profile = await requireAdmin(['super_admin', 'admin', 'competition_manager'])
//     const body = await request.json()
//     const matchId = String(body.matchId ?? '')
//     const officialId = String(body.officialId ?? '')
//     const role = String(body.role ?? 'chair_umpire')

//     if (!matchId || !officialId) {
//       return NextResponse.json({ error: 'matchId and officialId are required.' }, { status: 400 })
//     }

//     const cookieStore = await cookies()
//     const supabase = createSupabaseServerClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//         cookies: {
//           get(name) {
//             return cookieStore.get(name)?.value
//           },
//           set(name, value, options) {
//             cookieStore.set({ name, value, ...options })
//           },
//           remove(name, options) {
//             cookieStore.set({ name, value: '', ...options })
//           },
//         },
//       },
//     )
//     if (!supabase) {
//       return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
//     }

//     const { data: official } = await supabase.from('profiles').select('id,role').eq('id', officialId).single()
//     if (!official || !['official', 'tournament_official', 'competition_manager', 'admin', 'super_admin'].includes(official.role)) {
//       return NextResponse.json({ error: 'Selected profile is not an eligible tournament official.' }, { status: 400 })
//     }

//     const { error } = await supabase
//       .from('match_officials')
//       .upsert(
//         {
//           match_id: matchId,
//           profile_id: officialId,
//           role,
//           assigned_at: new Date().toISOString(),
//         },
//         { onConflict: 'match_id,profile_id,role' },
//       )

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 400 })
//     }

//     await supabase.from('audit_logs').insert({
//       actor_id: profile.id,
//       action: 'match.official_assigned',
//       entity_type: 'match',
//       entity_id: matchId,
//       metadata: { official_id: officialId, role },
//     })

//     return NextResponse.json({ matchId, officialId, role })
//   } catch (error: any) {
//     return NextResponse.json({ error: error?.message ?? 'Unable to assign official.' }, { status: 400 })
//   }
// }






import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function POST(request: Request) {
  try {
    const profile = await requireAdmin([
      "super_admin",
      "admin",
      "competition_manager",
    ]);

    const body = await request.json();
    const matchId = String(body.matchId ?? "");
    const officialId = String(body.officialId ?? "");
    const role = String(body.role ?? "chair_umpire");

    if (!matchId || !officialId) {
      return NextResponse.json(
        { error: "matchId and officialId are required." },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    const { data: official } = await supabase
      .from("profiles")
      .select("id,role")
      .eq("id", officialId)
      .single();

    if (
      !official ||
      ![
        "official",
        "tournament_official",
        "competition_manager",
        "admin",
        "super_admin",
      ].includes(official.role)
    ) {
      return NextResponse.json(
        { error: "Selected profile is not an eligible tournament official." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("match_officials")
      .upsert(
        {
          match_id: matchId,
          profile_id: officialId,
          role,
          assigned_at: new Date().toISOString(),
        },
        { onConflict: "match_id,profile_id,role" }
      );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    await supabase.from("audit_logs").insert({
      actor_id: profile.id,
      action: "match.official_assigned",
      entity_type: "match",
      entity_id: matchId,
      metadata: {
        official_id: officialId,
        role,
      },
    });

    return NextResponse.json({ matchId, officialId, role });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Unable to assign official." },
      { status: 400 }
    );
  }
}
