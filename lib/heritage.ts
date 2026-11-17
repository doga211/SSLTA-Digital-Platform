/**
 * SSLTA Digital Heritage & Media Centre
 * Source: SSLTA Annual Report 2023/2024. Proposed annual activities are
 * explicitly labelled as proposals until approved and dated by SSLTA.
 */
export type HeritageEvent = {
  id: string; title: string; date: string; venue: string; category: string;
  status: "Completed" | "Ongoing in report period" | "Proposed – approval required";
  summary: string; source: string;
};

export const historicalEvents: HeritageEvent[] = [
  { id:"sslta-inception-2023", title:"SSLTA inception", date:"8 June 2023", venue:"South Sudan", category:"Institutional milestone", status:"Completed", summary:"The Annual Report records 8 June 2023 as the inception date of the South Sudan Lawn Tennis Association.", source:"SSLTA Annual Report 2023/2024" },
  { id:"first-coaching-course-2023", title:"First National Coaching Course – Coaching Starter Players", date:"2–5 October 2023", venue:"Acacia Tennis Club, Acacia Village, Juba", category:"Coach development", status:"Completed", summary:"Sixteen coaches completed the national course and received certificates: ten school coaches and six SSLTA coaches, according to the President’s report.", source:"SSLTA Annual Report 2023/2024" },
  { id:"registration-2023", title:"National Youth and Sports Commission registration", date:"5 December 2023", venue:"South Sudan", category:"Institutional milestone", status:"Completed", summary:"SSLTA reports receiving Registration Certificate No. 003 dated 5 December 2023.", source:"SSLTA Annual Report 2023/2024" },
  { id:"school-tennis-2024", title:"School Tennis Initiative", date:"19 February–3 March 2024", venue:"Participating schools, Juba", category:"School development", status:"Completed", summary:"The report describes a school tennis programme following the national coaching workshop. The school count and participation total are inconsistent within the report and require confirmation before numerical claims are published.", source:"SSLTA Annual Report 2023/2024" },
  { id:"refresher-officiating-2024", title:"Coaching Starter Players Refresher and Officiating Fundamentals", date:"6–7 March 2024", venue:"Acacia Tennis Club, Acacia Village, Juba", category:"Coach and official development", status:"Completed", summary:"The President’s note records eighteen coaches attending the refresher and officiating programme.", source:"SSLTA Annual Report 2023/2024" },
  { id:"first-inter-schools-juniors-2024", title:"First Inter-Schools and Juniors Tournament", date:"8–10 March 2024", venue:"Acacia Village Tennis Court and Jubek Model Secondary School", category:"National competition", status:"Completed", summary:"The report records five participating schools and 33 junior players competing across age categories from U10 to U18. MTN is acknowledged as sponsor in the report.", source:"SSLTA Annual Report 2023/2024" },
  { id:"weekend-juniors-2024", title:"Weekend Junior Tennis Activities", date:"Reported during 2023/2024", venue:"Acacia Village Tennis Playground, Juba", category:"Junior development", status:"Ongoing in report period", summary:"The report describes Saturday and Sunday coaching for players aged 18 and under, in collaboration with Smash Tennis Foundation and Acacia Village, with 35 registered juniors reported.", source:"SSLTA Annual Report 2023/2024" },
  { id:"independence-championship-proposal-2024", title:"Second Juniors Tournament / Independence Juniors Championship", date:"July 2024 (proposed in report)", venue:"To be confirmed", category:"Junior competition", status:"Proposed – approval required", summary:"The annual report proposed this event for July 2024. The report does not establish that it subsequently took place.", source:"SSLTA Annual Report 2023/2024" },
];

export const annualProgrammeProposal = [
  ["January","National tennis season launch and registration","Federation / membership","Proposed – approval and dates required"],
  ["February","School Tennis Outreach and School Festival","Schools / grassroots","Proposed – approval and dates required"],
  ["March","Inter-Schools and Juniors Tournament","Schools / junior competition","Historical precedent: first edition held 8–10 March 2024; annual recurrence not confirmed"],
  ["April–May","Coaches and Officials Development Courses","Technical development","Proposed – approval and dates required"],
  ["June","SSLTA Foundation Anniversary Tennis Festival (8 June)","Anniversary / community","Proposed – approval and dates required"],
  ["July","Independence Juniors Championship","Junior competition","Proposed – approval and dates required; 2024 edition was only proposed in the report"],
  ["August–September","National Junior Development Series","Junior pathway","Proposed – approval and dates required"],
  ["October","National Open Tennis Championship","National competition","Proposed – approval and dates required"],
  ["November","State Tennis Development Festival","Regional development","Proposed – approval and dates required"],
  ["December","Season Finals, Awards and Annual Review","Federation / recognition","Proposed – approval and dates required"],
] as const;

export const juniorResults = [
  ["Inter-school U14 Girls","Juba Parents Primary","Gudele East One Primary"],
  ["Inter-school U14 Boys","Royal International","Juba Diplomatic Nursery and Primary"],
  ["U10 Mixed","Martha Hennry","Emmanuel Gireger"],
  ["U12 Girls","Gisma Hennry","Fawzia Mubarak"],
  ["U14 Girls","Catharine Faiz","Diana Lawrence"],
  ["U14 Boys","Francis Ladu","Patric John"],
  ["U16 Girls","Abuk Mading","Sunday Hennery"],
  ["U16 Boys","Bedry Hussein","Moris Lojang"],
  ["U18 Girls","Gift Ezbon","Naima Simon"],
  ["U18 Boys","Yohanna Moris","Emmanuel Elisa"],
] as const;

export const heritageStories = [
  { slug:"building-the-foundation-of-national-tennis", type:"Institutional history", title:"Building the Foundation of National Tennis in South Sudan", date:"8 June 2023", excerpt:"The SSLTA Annual Report identifies 8 June 2023 as the Association’s inception, marking the beginning of a phased effort to organise tennis, develop coaches and encourage participation.", body:["The South Sudan Lawn Tennis Association identifies 8 June 2023 as its inception date. In its 2023/2024 report, the Association describes an early programme built around basic equipment, encouraging players to take up the sport and developing coaches to help spread tennis.","The report also records the Association’s registration with the National Youth and Sports Commission, which issued Registration Certificate No. 003 dated 5 December 2023. This milestone forms part of the institutional record of the Association’s early development.","The report describes further work to build technical capacity, support junior activities and engage state-level sports authorities. These early steps provide an important foundation for the continuing development of tennis across South Sudan."] },
  { slug:"sixteen-coaches-complete-first-national-course", type:"Coach development", title:"Sixteen Coaches Complete SSLTA’s First National Coaching Course", date:"2–5 October 2023", excerpt:"Sixteen coaches completed the Coaching Starter Players course at Acacia Tennis Club in Juba, according to the SSLTA Annual Report 2023/2024.", body:["From 2 to 5 October 2023, SSLTA conducted its first national coaching course, titled Coaching Starter Players, at Acacia Tennis Club, Acacia Village, Juba.","The President’s note records that sixteen coaches completed the course and received certificates. Ten participants came from schools and six were from SSLTA. The course was part of the Association’s effort to build a technical base for the growth of tennis.","The school tennis initiative followed the coaching workshop in February and March 2024. The report’s participant totals and school count contain an inconsistency, so those figures should be confirmed against the original programme records before being republished."] },
  { slug:"first-inter-schools-and-juniors-tournament-2024", type:"Competition history", title:"First Inter-Schools and Juniors Tournament Brings Young Players Together", date:"8–10 March 2024", excerpt:"SSLTA’s report records the first inter-schools and juniors tournament at Acacia Village Tennis Court and Jubek Model Secondary School.", body:["The first Inter-Schools and Juniors Tournament was held from 8 to 10 March 2024 at Acacia Village Tennis Court and Jubek Model Secondary School. The Annual Report acknowledges MTN as sponsor.","The inter-school competition featured U14 boys and girls. The report lists Juba Parents Primary and Royal International as the respective winners, with Gudele East One Primary and Juba Diplomatic Nursery and Primary as runners-up.","The junior competition recorded 33 boys and girls across U10, U12, U14, U16 and U18 categories. The published results in the archive reproduce the names as written in the Annual Report; SSLTA should verify spellings against official result sheets before final publication."] },
  { slug:"weekend-junior-tennis-at-acacia-village", type:"Junior development", title:"Weekend Tennis Activities Support Junior Development", date:"2023/2024 reporting period", excerpt:"The annual report describes weekend coaching for players aged 18 and under at Acacia Village, delivered with Smash Tennis Foundation.", body:["The SSLTA Annual Report 2023/2024 describes junior coaching activities taking place every Saturday and Sunday at the Acacia Village tennis playground.","The programme was delivered in collaboration with Smash Tennis Foundation and Acacia Village. The report states that 35 boys and girls were registered in the junior activities during the reporting period.","The Association’s report presents these sessions as part of its work to grow participation and create development opportunities for young players."] },
];

export const galleryItems = [
  { src:"/images/sslta-coaching.jpg", title:"Coach development activities", caption:"Coaching activity image from the existing SSLTA website asset library. Confirm event date, photographer credit and participant consent before attaching a historical event label." },
  { src:"/images/sslta-junior-1.jpg", title:"Junior tennis participation", caption:"Junior tennis image. Confirm date, event attribution and guardian consent before public use." },
  { src:"/images/sslta-junior-2.jpg", title:"Junior development", caption:"Junior development image. Confirm date, event attribution and guardian consent before public use." },
  { src:"/images/sslta-event-1.jpg", title:"Tennis event moment", caption:"Existing event image. Confirm event name, date, photographer credit and participant consent." },
  { src:"/images/sslta-event-2.jpg", title:"Tennis community activity", caption:"Existing event image. Confirm event name, date, photographer credit and participant consent." },
  { src:"/images/sslta-event-3.jpg", title:"Competition activity", caption:"Existing event image. Confirm event name, date, photographer credit and participant consent." },
  { src:"/images/sslta-event-4.jpg", title:"Tennis on court", caption:"Existing event image. Confirm event name, date, photographer credit and participant consent." },
  { src:"/images/sslta-awards.jpg", title:"Recognition and awards", caption:"Existing awards image. Confirm event date, award details, names and publication permissions." },
];
