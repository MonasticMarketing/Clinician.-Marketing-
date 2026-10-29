import { content } from "@/content/content";

/**
 * The Psychology Today optimization guide.
 *
 * Unlike the blog, which renders Markdown, this page was authored as
 * hand-built HTML: the diagram, fact grid, comparison tables, example
 * boxes and two-column checklist carry the argument, and Markdown cannot
 * express them. The markup below is ours, written at build time into the
 * page — no user input reaches it.
 *
 * Styling lives under `.pt-guide` in globals.css.
 */

/** Substituted below, so the scheduler URL has one source of truth. */
const SCHEDULER_PLACEHOLDER = /__SCHEDULER_URL__/g;

const BODY = String.raw`<nav class="toc" aria-label="On this page">
  <div class="lbl">On this page</div>
  <ol>
    <li><a href="#how">How Psychology Today decides who you see</a></li>
    <li><a href="#why">Why it works this way</a></li>
    <li><a href="#appear">Lever 1: Appear in more qualifying searches</a></li>
    <li><a href="#card">Lever 2: Win the click from the results card</a></li>
    <li><a href="#convert">Lever 3: Convert the profile view</a></li>
    <li><a href="#google">Lever 4: Rank the profile on Google</a></li>
    <li><a href="#prescribers">Psychiatrists and PMHNPs</a></li>
    <li><a href="#groups">Group practices and programs</a></li>
    <li><a href="#measure">Measure it and test one thing at a time</a></li>
    <li><a href="#myths">What does not work</a></li>
    <li><a href="#compliance">Compliance notes</a></li>
    <li><a href="#checklist">The checklist</a></li>
    <li><a href="#faq">Questions clinicians ask us</a></li>
    <li><a href="#refs">References</a></li>
  </ol>
</nav>

<p>Most clinicians treat Psychology Today like a search engine. They look for the trick that moves a profile to the top, hear from a colleague that re-saving the profile on Mondays does it, and feel cheated when nothing changes.</p>
<p>The directory does not work like Google. A profile passes or fails a set of gates, takes a random turn among everyone who passed, and then has a results card and a profile page that either earn a contact or do not. Every change that helps works on one of those three stages. The rest of the advice circulating in clinician groups is folklore.</p>
<p>This guide explains the mechanism first, because once you see it the right changes are obvious. Then it walks through each lever with the field limits, what to write, and how to tell whether it worked. Where a claim comes from Psychology Today itself we say so. Where it comes from consultants who have screenshotted the editor, or from clinicians reporting their own dashboards, we say that too, since it changes how much weight to put on it.</p>


<h2 id="how">How Psychology Today decides who you see</h2>

<p>A prospective client types a city or zip code. They might click one of the quick toggles (In Person, Online, Available) and a filter or two (Anxiety, Aetna, Couples, under $130). They get a page of twenty cards. Here is what happened between the search and that page, as best it can be established.</p>

<h3>Step one: the gates</h3>
<p>Psychology Today's search is a filtered directory. There is no free-text search box on results pages; you can search by location or by a therapist's name, nothing else.<sup><a href="#r1" aria-label="Reference 1">1</a></sup> Every filter in the sidebar is a checkbox match against your profile. If a client filters for Online, Teens and Blue Cross, and your profile has Online unchecked, or Teens missing from your age groups, or that insurer absent from your list, you are not on the page at all.</p>
<p>Location works the same way. Your profile is listed in the areas your dashboard says it is listed in: your office zip automatically, plus the additional listing areas you choose, plus a statewide online listing for each state where you hold a license and have Online checked.<sup><a href="#r6" aria-label="Reference 6">6</a></sup> A zip code search shows exact matches for that zip first, then falls back to a "More Therapists Nearby" block drawn from surrounding areas when the zip is thin.<sup><a href="#r2" aria-label="Reference 2">2</a></sup> No radius is published anywhere, and there is no distance sort.</p>

<h3>Step two: the rotation</h3>
<p>Among profiles that pass the gates, order is randomized. This is the one thing Psychology Today states plainly on its About page: its algorithms are tuned for "fairness and relevance," randomized rotation ensures no single listing dominates, everyone pays the same, and there are no premium placements or paid rankings.<sup><a href="#r3" aria-label="Reference 3">3</a></sup> Clinicians who have asked support get the same answer: results are randomized and there is no way to force a profile to the top.<sup><a href="#r4" aria-label="Reference 4">4</a></sup> A spokesperson told ClearHealthCosts in early 2026 that network affiliation has no effect on placement and that the company periodically rebalances its algorithms to spread traffic rather than concentrate it.<sup><a href="#r5" aria-label="Reference 5">5</a></sup></p>
<p>In a market with 200 qualifying therapists, that puts you in the top five for roughly one search in forty.<sup><a href="#r7" aria-label="Reference 7">7</a></sup> In a market with 40, it is one in eight. You cannot buy or game the rotation. What you can do is shrink the pool you rotate in by choosing where and how you qualify.</p>

<h3>Step three: the card, then the page</h3>
<p>When your turn in the rotation comes, the client sees a card: a circular photo, your name and credential line, your city, the first couple of hundred characters of your personal statement, a tap-to-call number, an Email button and any labels you have earned (Verified, Online Only, a waitlist notice, an endorsement count).<sup><a href="#r2" aria-label="Reference 2">2</a></sup> They tap or they scroll. If they tap, the profile page has to answer three questions fast: do you get me, can you help, and what happens next.</p>

<figure>
<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="funnel-t">
<title id="funnel-t">Four stages of a Psychology Today search: gates, rotation, card, profile</title>
<defs>
<marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10z" fill="#5EA3FF"/></marker>
</defs>
<g font-family="inherit">
<rect x="10" y="60" width="160" height="150" rx="14" fill="#0D1330" stroke="#243061"/>
<text x="90" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="#8B7CFF" letter-spacing="2">GATES</text>
<text x="90" y="124" text-anchor="middle" font-size="15" font-weight="700" fill="#E8EBF7">Location + filters</text>
<text x="90" y="148" text-anchor="middle" font-size="13" fill="#A9B1D1">Pass or fail.</text>
<text x="90" y="168" text-anchor="middle" font-size="13" fill="#A9B1D1">No partial credit.</text>
<text x="90" y="194" text-anchor="middle" font-size="12" fill="#7D86AB">You control: checkboxes, zips</text>

<rect x="200" y="60" width="160" height="150" rx="14" fill="#0D1330" stroke="#243061"/>
<text x="280" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="#8B7CFF" letter-spacing="2">ROTATION</text>
<text x="280" y="124" text-anchor="middle" font-size="15" font-weight="700" fill="#E8EBF7">Randomized order</text>
<text x="280" y="148" text-anchor="middle" font-size="13" fill="#A9B1D1">Top 5 about 1 in</text>
<text x="280" y="168" text-anchor="middle" font-size="13" fill="#A9B1D1">(qualifiers ÷ 5) searches</text>
<text x="280" y="194" text-anchor="middle" font-size="12" fill="#7D86AB">You control: pool size</text>

<rect x="390" y="60" width="160" height="150" rx="14" fill="#0D1330" stroke="#243061"/>
<text x="470" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="#8B7CFF" letter-spacing="2">CARD</text>
<text x="470" y="124" text-anchor="middle" font-size="15" font-weight="700" fill="#E8EBF7">Results view</text>
<text x="470" y="148" text-anchor="middle" font-size="13" fill="#A9B1D1">Photo, first ~200</text>
<text x="470" y="168" text-anchor="middle" font-size="13" fill="#A9B1D1">characters, labels</text>
<text x="470" y="194" text-anchor="middle" font-size="12" fill="#7D86AB">Metric: click rate 3 to 11%</text>

<rect x="580" y="60" width="170" height="150" rx="14" fill="#141B3D" stroke="#8B7CFF"/>
<text x="665" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="#8B7CFF" letter-spacing="2">PROFILE</text>
<text x="665" y="124" text-anchor="middle" font-size="15" font-weight="700" fill="#E8EBF7">Profile view</text>
<text x="665" y="148" text-anchor="middle" font-size="13" fill="#A9B1D1">Statement, fees,</text>
<text x="665" y="168" text-anchor="middle" font-size="13" fill="#A9B1D1">video, reply speed</text>
<text x="665" y="194" text-anchor="middle" font-size="12" fill="#7D86AB">Metric: contact rate</text>

<line x1="172" y1="135" x2="196" y2="135" stroke="#5EA3FF" stroke-width="2" marker-end="url(#arr)"/>
<line x1="362" y1="135" x2="386" y2="135" stroke="#5EA3FF" stroke-width="2" marker-end="url(#arr)"/>
<line x1="552" y1="135" x2="576" y2="135" stroke="#5EA3FF" stroke-width="2" marker-end="url(#arr)"/>

<text x="90" y="250" text-anchor="middle" font-size="12" fill="#7D86AB">Dashboard:</text>
<text x="90" y="268" text-anchor="middle" font-size="13" font-weight="700" fill="#5EA3FF">Results Views</text>
<text x="470" y="250" text-anchor="middle" font-size="12" fill="#7D86AB">Dashboard:</text>
<text x="470" y="268" text-anchor="middle" font-size="13" font-weight="700" fill="#5EA3FF">Profile Views</text>
<text x="665" y="250" text-anchor="middle" font-size="12" fill="#7D86AB">Dashboard:</text>
<text x="665" y="268" text-anchor="middle" font-size="13" font-weight="700" fill="#5EA3FF">Contacts</text>
</g>
</svg>
<figcaption>The four stages of a Psychology Today search and the dashboard metric that measures each one. Only the first and second stages decide whether you are seen; the third and fourth decide whether you are contacted.</figcaption>
</figure>

<div class="callout blue"><p><span class="lbl">In short:</span> you do not rank on Psychology Today. You qualify, you take your turn in the rotation, and then you convert. So qualify for more searches, keep the pools you rotate in small, and build a card and a profile that earn the contact when your turn comes.</p></div>

<h2 id="why">Why it works this way</h2>
<p>Psychology Today's directory charges a flat $29.95 a month, a price it says has not changed since 2004.<sup><a href="#r8" aria-label="Reference 8">8</a></sup> There is no premium tier and nothing to upsell. That business model only holds if clinicians believe the system is fair, which is why the rotation is randomized. If placement could be bought, the flat fee would stop making sense and the directory would become an ad auction, which the company tells journalists it refuses to do.<sup><a href="#r5" aria-label="Reference 5">5</a></sup></p>
<p>Two things follow for you.</p>
<p>Fairness is applied per search. Every profile that qualifies for a search gets an equal turn, so a profile that qualifies for more searches (more listing areas, more filter matches, Online checked in more licensed states) gets more turns. The terms allow this, and it is the main thing you control.</p>
<p>Because the directory cannot reward a good profile with a better position, quality pays off after the client sees you. The spokesperson's own framing is that complete, client-focused, transparent profiles with strong photos and video "tend to perform well."<sup><a href="#r5" aria-label="Reference 5">5</a></sup> Perform means contacts; nothing about the profile changes its place in the rotation. Two profiles with the same exposure can produce very different numbers of inquiries, and that gap is yours to close.</p>
<p>The environment has also changed. Through late 2025 and 2026 many clinicians reported sharp drops in results views and contacts, some by 80 to 90 percent over five years, while Psychology Today has said it sees no overall decline.<sup><a href="#r5" aria-label="Reference 5">5</a></sup> Whatever the cause, an unoptimized profile has less margin than it used to. One that produced ten inquiries a month on autopilot may now produce two. The levers below get the most out of whatever volume your market still has, and they are also why we treat the directory as one channel among several.</p>

<div class="kicker">Lever 1</div>
<h2 id="appear">Appear in more qualifying searches</h2>
<p>This is the only lever that changes how often you are seen, so it comes first.</p>

<h3>Set every listing area you are allowed</h3>
<p>Your office zip is listed automatically. The dashboard lets you add additional listing areas, and consultants who have documented the current editor describe three listing areas per location: the auto-listed office zip plus two you choose.<sup><a href="#r6" aria-label="Reference 6">6</a></sup> Older write-ups describe four targets, so expect the count to vary by account and check yours. Separately, you can add an Additional Location, a full second practice address (physical or a virtual service area where you genuinely see clients remotely) that carries its own listing areas, at no extra charge.<sup><a href="#r6" aria-label="Reference 6">6</a>,<a href="#r9" aria-label="Reference 9">9</a></sup></p>
<p>A listing area is not a radius. You appear when someone searches that zip, or when that zip is pulled into a thin search's nearby block. So choose zips the way you would choose a billboard location.</p>
<ul>
<li>Pick zips where your ideal clients live. A trauma therapist near a university belongs in the student housing zips, not in three industrial zips that happen to be adjacent to the office.</li>
<li>Pick zips with thinner competition. Search each candidate zip with your top specialty filter applied and count the results. A zip with 60 qualifying therapists gives you a top-five turn about one search in twelve; a zip with 500 gives you one in a hundred.<sup><a href="#r6" aria-label="Reference 6">6</a></sup></li>
<li>Change one zip at a time and give it six to eight weeks. Dashboard changes take a few days to propagate and the rotation is noisy week to week.<sup><a href="#r6" aria-label="Reference 6">6</a>,<a href="#r10" aria-label="Reference 10">10</a></sup></li>
</ul>

<h3>Turn on the statewide online listing in every state you are licensed</h3>
<p>Checking Online/Telehealth is a filter attribute, not a separate listing. Each state license entered in your account produces a statewide teletherapy listing (your dashboard shows these under Teletherapy Listing Areas) and those do not consume your zip slots.<sup><a href="#r6" aria-label="Reference 6">6</a></sup> A clinician licensed in three states is in three statewide rotations from one profile. If you hold compact privileges (PSYPACT, the Counseling Compact), ask support whether those can be entered as licensed states; clinicians on live pages currently write "PSYPACT participating states" into their statement instead, which does nothing for the filter but at least tells the reader.<sup><a href="#r11" aria-label="Reference 11">11</a></sup></p>
<p>The trade-off is that the statewide online pool is everyone licensed in the state, so your turn comes less often. The statewide listing brings volume; the zip targets bring precision.</p>

<div class="callout warn"><p><span class="lbl">Addresses:</span> the 2026 Terms of Use require a valid physical business address you own, lease or have a professional right to use, and transparent disclosure of whether you see clients in person, online or both.<sup><a href="#r12" aria-label="Reference 12">12</a></sup> Virtual mailbox addresses are no longer accepted.<sup><a href="#r9" aria-label="Reference 9">9</a></sup> If you are telehealth only, use your real home or office address, tick the box that hides the street address, check Online, uncheck In Person. Do not invent a city to get into its results; it violates the terms and produces inquiries you cannot serve.</p></div>

<h3>Check every filter you can genuinely satisfy</h3>
<p>The filter panel is long: roughly 90 specialties and issues, 70 types of therapy, 50 insurers, six age groups, gender, ethnicity, faith, language, sexuality and community filters, price tiers, session format and the Available toggle.<sup><a href="#r1" aria-label="Reference 1">1</a></sup> Each one you leave unchecked is a search you cannot appear in. These are the fields that most often go unfilled:</p>
<ul>
<li>Participants (Individuals, Couples, Family, Group) and Age groups. An unchecked Couples box removes you from every couples search.<sup><a href="#r13" aria-label="Reference 13">13</a></sup></li>
<li>Service type. In Person and Online are separate boxes, and a hybrid practice needs both.</li>
<li>Fee. Leave it blank and you are excluded from price-filtered searches. Therapist price tiers are under $90, $90 to $130, over $130, plus Sliding Scale; psychiatrist tiers are under $250, $250 to $350, over $350.<sup><a href="#r1" aria-label="Reference 1">1</a></sup></li>
<li>Insurance. Check every panel you are on, and the out-of-network box if you provide superbills. Leaving a panel you accept unchecked is one of the most expensive omissions on the platform.<sup><a href="#r14" aria-label="Reference 14">14</a></sup></li>
<li>Communities, faith, language and sexuality. Only check what you are competent and comfortable serving. These filters are small pools, which makes them valuable.</li>
</ul>

<h3>Specialties: enough to qualify, few enough to be believed</h3>
<p>Specialties, Issues and Types of Therapy are open checklists with no hard cap, and you star exactly three as Top Specialties, which get visual prominence on the profile.<sup><a href="#r13" aria-label="Reference 13">13</a>,<a href="#r15" aria-label="Reference 15">15</a></sup> Consultants disagree on the right number (recommendations run from five to fifteen), and the disagreement is really about two different goals. Checking more boxes puts you in more filtered searches. Checking too many turns the profile into a résumé a client does not believe.</p>
<p>Our rule: check what you can treat competently and explain in plain words to a client, typically eight to twelve. Star the three that define the practice you want to grow, and before you star them, search each one in your main zip and count the competition. A top specialty with 80 local competitors is worth more than one with 600.<sup><a href="#r15" aria-label="Reference 15">15</a></sup> Use the two free-text Other Issues fields for niches absent from Psychology Today's list, and the 400-character Note on Top Specialties to say what those three mean in practice.</p>

<h3>Keep availability accurate</h3>
<p>Cards show "Waitlist for new clients" and "Not accepting new clients" labels, and the Available filter appears to exclude both.<sup><a href="#r2" aria-label="Reference 2">2</a></sup> When you are full, set the status rather than deactivating; a deactivated profile loses its place in every rotation and its history, while a waitlisted one still appears in unfiltered searches and keeps the inquiries you can schedule later.<sup><a href="#r16" aria-label="Reference 16">16</a></sup> Showing as available when you are full erodes trust and wastes the client's one remaining ounce of motivation.</p>

<div class="kicker">Lever 2</div>
<h2 id="card">Win the click from the results card</h2>
<p>When your turn in the rotation comes, you get a card next to nineteen others. The dashboard measures this stage as Profile Views divided by Results Views, and three to eleven percent is the normal range.<sup><a href="#r17" aria-label="Reference 17">17</a></sup> Four elements on the card are yours to control.</p>

<h3>The photo</h3>
<p>The card crops your photo to a circle. Upload at least 400 by 400 pixels, with the face centered in the upper two-thirds of the frame so the crop does not cut it, on a plain or softly blurred background, lit from the front or side, shoulders up.<sup><a href="#r18" aria-label="Reference 18">18</a></sup> A warm, open expression consistently outperforms the polished corporate headshot; one practice coach who ran two photos from the same session reports the approachable one pulled more inquiries.<sup><a href="#r19" aria-label="Reference 19">19</a></sup> Never a logo in place of a face: a group practice that swapped clinician headshots for its logo watched inquiries fall.<sup><a href="#r20" aria-label="Reference 20">20</a></sup> No selfies, pets, children or partners. Refresh it every year or two.</p>

<h3>The first 200 characters</h3>
<p>The standalone tagline field has been retired. The opening of your first personal statement box now appears under your name on the card, and the card shows roughly the first 200 characters, two or three sentences, before truncating.<sup><a href="#r15" aria-label="Reference 15">15</a>,<a href="#r21" aria-label="Reference 21">21</a></sup> Those sentences are your headline, your card copy and, as covered under Google below, your search snippet. Their one job is to make the right client feel recognized. Describing the client's situation does that; listing credentials and modalities does not.</p>

<div class="example">
<div class="lbl">Card copy, rewritten</div>
<p><span class="bad">Licensed Professional Counselor with 12 years of experience providing CBT, DBT and EMDR to adults, adolescents and couples in a safe, supportive, non-judgmental environment.</span></p>
<p>You look fine from the outside. Inside, the worry never switches off, sleep is thin, and you are tired of managing everyone else's feelings while nobody asks about yours. I work with high-functioning adults with anxiety who are done white-knuckling it.</p>
<p class="count">Second version: 231 characters, client-first, names the specialty and the population in the words a client would use.</p>
</div>

<h3>The labels</h3>
<p>The Verified seal means Psychology Today staff checked your license against your state's online database, and it is re-checked at each renewal.<sup><a href="#r22" aria-label="Reference 22">22</a></sup> It costs nothing, it appears on the card, and city pages describe their listings as "verified therapists," so a profile without it looks like the exception. Endorsements from colleagues show as a count on the card. Ask for them from clinicians who know your work and give real reasons; generic endorsements read as padding.</p>

<h3>The video</h3>
<p>A short intro video (the stated limit is 15 seconds, vertical, MP4, with a 140-character caption) puts a play icon on your card photo, and video profiles also appear in a video strip partway down results pages, which is an extra placement most of your competitors do not have.<sup><a href="#r23" aria-label="Reference 23">23</a>,<a href="#r24" aria-label="Reference 24">24</a></sup> Psychology Today has not published numbers on video lift, and the claim that video profiles are "shown more often" is unverified, so the value is the conversion plus the extra placement; it does nothing for your position in the rotation. The script is your name, who you help, one thing they are struggling with, what it is like to work with you, and what to do next, in about fifty words. Film it on a phone in a quiet room with window light, looking at the lens.</p>

<div class="kicker">Lever 3</div>
<h2 id="convert">Convert the profile view</h2>
<p>A client who taps through is comparing you to two or three others in open tabs. The profile has to answer "do you get me," "can you help," and "what happens next" without making them hunt. The dashboard measures this stage as Contacts divided by Profile Views.</p>

<h3>The three boxes</h3>
<p>The personal statement is three separate fields with their own prompts and limits (as shown in current editor screenshots; verify in yours):<sup><a href="#r15" aria-label="Reference 15">15</a>,<a href="#r21" aria-label="Reference 21">21</a></sup></p>

<div class="tbl" tabindex="0" role="region" aria-label="Personal statement fields and character limits">
<table>
<thead><tr><th>Field</th><th>Limit</th><th>What it is for</th></tr></thead>
<tbody>
<tr><td>What can I help you with?</td><td class="num">640 characters</td><td>The client's problem in their words, who you work with, and hope. The first ~200 characters are the card and the Google snippet.</td></tr>
<tr><td>What's my approach?</td><td class="num">360 characters</td><td>How you work, in plain language. What a first session feels like. Name modalities only if you translate them.</td></tr>
<tr><td>About me</td><td class="num">360 characters</td><td>Brief credentials, a line of personality, and a direct call to action.</td></tr>
<tr><td>Intro to new clients</td><td class="num">140 characters</td><td>Treat it like an email subject line: the one thing a new client should know.</td></tr>
<tr><td>Note on Finance</td><td class="num">300 characters</td><td>Fee philosophy, sliding scale terms, out-of-network reimbursement, free consult.</td></tr>
<tr><td>Note on Top Specialties</td><td class="num">400 characters</td><td>What your three starred specialties mean in practice.</td></tr>
<tr><td>Note on Therapy Types</td><td class="num">400 characters</td><td>What the modalities you checked look like in the room.</td></tr>
<tr><td>Note on Credentials</td><td class="num">300 characters</td><td>Training that matters to the client, not the full CV.</td></tr>
</tbody></table></div>

<p>Write to about 80 percent of each limit so nothing truncates on mobile.<sup><a href="#r15" aria-label="Reference 15">15</a></sup> Write in second person to one specific client; "you" converts, "clients" does not.<sup><a href="#r25" aria-label="Reference 25">25</a></sup> Use the words a client types, not the words on your license: "intrusive thoughts" before "OCD," "can't stop fighting" before "high-conflict couples work." Every acronym gets a plain-English clause after it or gets cut.</p>

<div class="example">
<div class="lbl">Box 2 and Box 3, example</div>
<p><strong>Approach.</strong> We start with what is happening this week, not your childhood. I use EMDR (a structured way of processing memories that still feel live) and practical skills you can use between sessions. Expect direct feedback and a plan, not fifty minutes of nodding.</p>
<p><strong>About me.</strong> Licensed psychologist, trained at a trauma-focused hospital program, in practice since 2014. I am dry, warm and allergic to jargon. If this sounds like a fit, tap Email Me and tell me what is going on; I reply within one business day and offer a free 15-minute call.</p>
</div>

<h3>Fees and insurance, stated plainly</h3>
<p>Results pages now show a local comparison panel with the average session cost and the share of therapists taking each insurer, so clients arrive at your profile already knowing the going rate.<sup><a href="#r1" aria-label="Reference 1">1</a></sup> Hiding your fee reads as expensive. State it, state sliding-scale terms if you offer them, and if you do not take insurance, say so in the first line of the Finance note and explain out-of-network reimbursement in one sentence. That cuts the poor-fit inquiries that burn your time and the client's hope. Clinicians who accept insurance and check every panel consistently report the strongest directory volume.<sup><a href="#r14" aria-label="Reference 14">14</a></sup></p>

<h3>Contact buttons and the reply</h3>
<p>Profiles carry Email Me and Call Me buttons; the Call button uses a protected forwarding number so your line stays private and the dashboard can count calls.<sup><a href="#r8" aria-label="Reference 8">8</a></sup> Two things most clinicians get wrong:</p>
<ul>
<li>Test the buttons after every edit. A broken website link or an email form that routes to an unmonitored inbox is the most common reason a profile with healthy views produces nothing.<sup><a href="#r26" aria-label="Reference 26">26</a></sup></li>
<li>Reply the same business day, ideally within hours. Clients contact several therapists in one sitting and the first to answer usually gets them; practice-management data shows scheduling likelihood is highest when a reply lands within an hour and falls sharply after 24.<sup><a href="#r27" aria-label="Reference 27">27</a></sup> If you cannot answer within the day, a CRM auto-reply that acknowledges the inquiry, offers a booking link for a free consult and sets an expectation buys you the time.</li>
</ul>
<p>If you link to a scheduler, link to one that shows availability before it demands a name and phone number. A form wall before the calendar loses the client who was ready to book.<sup><a href="#r28" aria-label="Reference 28">28</a></sup></p>

<div class="kicker">Lever 4</div>
<h2 id="google">Rank the profile on Google</h2>
<p>The one place a Psychology Today profile really does rank is Google. Individual profile pages are indexable (robots meta "index, follow," a self-referencing canonical, nothing blocking them in robots.txt) and the company claims its pages are the top result for therapy seekers 96.2 percent of the time.<sup><a href="#r29" aria-label="Reference 29">29</a>,<a href="#r8" aria-label="Reference 8">8</a></sup> In smaller markets, individual profiles appear on page one for "[specialty] therapist [city]" searches; in large metros, Psychology Today's own city and specialty listing pages usually take those spots and the individual profile is less likely to.<sup><a href="#r29" aria-label="Reference 29">29</a></sup></p>
<p>What Google reads from your profile:</p>
<ul>
<li>The title tag follows a fixed pattern: Name, Profession, City, State, Zip | Psychology Today. You cannot edit it, which is why your name, credential and city fields need to be exactly what you want indexed.<sup><a href="#r29" aria-label="Reference 29">29</a></sup></li>
<li>The meta description is your name, city, zip and phone followed by the opening of your personal statement.<sup><a href="#r29" aria-label="Reference 29">29</a></sup> The first two sentences of Box 1 are, literally, your Google snippet. Put the specialty, the population and the city or neighborhood in them, in natural language.</li>
<li>The body is the rest of the statement plus your specialties, fees, insurance and license line. One UK therapist documented reaching Google page one for her niche in about three months by front-loading her keywords in the first fifty words, repeating the core phrase naturally through the three boxes, naming the neighborhoods she serves and updating quarterly.<sup><a href="#r30" aria-label="Reference 30">30</a></sup></li>
</ul>
<p>Two cautions. The "My website" button is a tracked redirect through Psychology Today, so it sends traffic but no link equity; do not count it as a backlink.<sup><a href="#r31" aria-label="Reference 31">31</a></sup> And keyword stuffing reads badly to the client who lands on the page, who is the only reader that pays you. Write for the client first and let the specialty and location fall where they naturally would.</p>
<p>Keep your name, credentials, practice name, address format and phone number identical across Psychology Today, your website, your Google Business Profile and any other directory. Inconsistent listings confuse Google about which entity you are. If you are telehealth only, note that Google Business Profile generally excludes online-only businesses, so the statewide online listing on Psychology Today does more of your Google work than it would for an office-based practice.<sup><a href="#r32" aria-label="Reference 32">32</a></sup> The Verified seal embed code for your site links back to your profile by default; you can keep the image and remove the link if you would rather not send visitors off your site.<sup><a href="#r33" aria-label="Reference 33">33</a></sup></p>

<h2 id="prescribers">Psychiatrists and PMHNPs</h2>
<p>Prescribers live in a separate Psychiatrists directory with its own filters: provider type (MD, PMHNP, psychiatric RN, PA), Medication Management as a filterable specialty, and higher price tiers.<sup><a href="#r34" aria-label="Reference 34">34</a></sup> The FAQ on those pages explains the difference between a psychiatrist and a PMHNP and whether therapy is included, which tells you what the searcher is confused about when they reach your profile. Answer it in Box 1:</p>
<ul>
<li>Medication management only, medication plus therapy, or evaluation and referral back to a therapist.</li>
<li>Typical time to a first appointment, and whether you offer evaluation-only visits.</li>
<li>Which states you prescribe in and whether visits are in person, video or both.</li>
<li>Your policy on controlled substances, stated once and without apology.</li>
<li>Niche services by name (TMS, ketamine-assisted treatment, perinatal psychiatry, ADHD evaluation) because they are both filters and Google keywords.<sup><a href="#r35" aria-label="Reference 35">35</a></sup></li>
</ul>
<p>Accurate "accepting new patients" status is a bigger differentiator for prescribers than for therapists. A secret-shopper study of 948 psychiatrists found fewer than one in five accepting new patients, with median waits of 67 days in person and 43 by telepsychiatry.<sup><a href="#r36" aria-label="Reference 36">36</a></sup> A prescriber who is available, says so, and replies the same day stands out before the client reads a word of the bio.</p>

<h2 id="groups">Group practices and programs</h2>
<p>Psychology Today's Group Practice feature is free with a subscription, supports up to 25 members, gives the practice its own searchable page and links every clinician's profile back to it.<sup><a href="#r13" aria-label="Reference 13">13</a></sup> Use it, and know that what pulls inquiries is the individual clinician profiles: real faces, each statement written for that clinician's caseload, each with its own listing areas and filters. A practice page with a logo and a generic statement rarely earns the contact on its own.</p>
<p>For a practice of five to ten, the optimization is operational more than editorial. Standardize the three boxes with a template that still sounds like each person, assign listing areas so clinicians are not all rotating in the same two zips, make sure every profile's insurance list matches the practice's actual contracts, route every Email Me and forwarded call into one intake queue with a same-day reply standard, and review the dashboard numbers per clinician monthly. The profile that gets 300 results views and no contacts has a card problem; the one that gets 40 profile views and no contacts has a page problem; the one that gets contacts and no clients has an intake problem. Those are three different fixes.</p>
<p>IOP, PHP and residential programs use a separate treatment-center listing at a higher monthly fee, and clinical staff may still hold individual profiles.<sup><a href="#r8" aria-label="Reference 8">8</a></sup> Note that the Terms do not allow an individual profile to promote a clinic brand or other clinicians, so the program page carries the program story and the clinician pages carry the clinician story.<sup><a href="#r12" aria-label="Reference 12">12</a></sup></p>

<h2 id="measure">Measure it and test one thing at a time</h2>
<p>The dashboard's Profile Performance panel reports Results Views (times you appeared in search), Profile Views (clicks to your page), Video Plays, Web Visits, Emails, Calls (only with call routing on) and Total Contacts, with a year selector for comparison.<sup><a href="#r13" aria-label="Reference 13">13</a></sup> Three ratios tell you where the problem is:</p>

<div class="facts">
<div class="fact"><div class="n">3 to 11%</div><div class="l">Click rate: Profile Views ÷ Results Views</div><div class="s">Below 3%: fix the photo and first 200 characters</div></div>
<div class="fact"><div class="n">Contacts ÷ Views</div><div class="l">Contact rate, measured monthly</div><div class="s">Falling: fix fees clarity, buttons, video, statement</div></div>
<div class="fact"><div class="n">25 to 30%</div><div class="l">Inquiry to first session, typical</div><div class="s">Below that: fix reply speed and intake</div></div>
</div>

<p>Change one variable at a time and hold it for 30 to 60 days before judging, because the rotation is random and a single week tells you nothing.<sup><a href="#r10" aria-label="Reference 10">10</a>,<a href="#r20" aria-label="Reference 20">20</a></sup> Ask every new client how they found you and record it in your CRM; the dashboard counts contacts, and only your CRM knows which of them became clients.</p>
<p>The ROI math is simple. At $29.95 a month the listing costs about $360 a year.<sup><a href="#r8" aria-label="Reference 8">8</a></sup> One retained client at $150 a session for twenty sessions is $3,000. If an optimized profile produces one additional client a year, it has paid for itself eight times over; clinicians reporting two to three new clients a year from the directory still call it worthwhile.<sup><a href="#r37" aria-label="Reference 37">37</a></sup> The fee is small next to the cost of a client who tapped your card and chose someone else.</p>

<h2 id="myths">What does not work</h2>
<ul>
<li>Re-saving or lightly editing the profile to "bump" it. Widely believed, never confirmed, and the one documented test found a brief blip the first time and nothing after.<sup><a href="#r38" aria-label="Reference 38">38</a></sup> Edit when you have something to improve.</li>
<li>Logging in daily, clicking your own profile, calling your own number. No evidence, and the company says activity does not affect placement.<sup><a href="#r5" aria-label="Reference 5">5</a></sup></li>
<li>Paying for a Featured or Sponsored spot. It does not exist. Any guide that says otherwise is describing a product Psychology Today denies selling.<sup><a href="#r3" aria-label="Reference 3">3</a></sup></li>
<li>Buying a second profile to appear twice in the same zip. Allowed only with a unique statement, and it doubles your cost for a second ticket in the same lottery. A second profile makes sense for a genuinely different state or specialty, not for the same search.<sup><a href="#r12" aria-label="Reference 12">12</a>,<a href="#r39" aria-label="Reference 39">39</a></sup></li>
<li>Stuffing a tagline into your last-name field. It breaks the title tag and your Verified match.<sup><a href="#r13" aria-label="Reference 13">13</a></sup></li>
<li>Checking every specialty on the list. You qualify for more searches and convert fewer of them.</li>
<li>A logo instead of a face, a stock photo, or a generic "safe and non-judgmental space" opener. They make you indistinguishable from the other nineteen cards.</li>
<li>Treating the directory as the practice's only channel. Directory volume has been falling for many clinicians. A website that converts, a Google Business Profile, referral relationships and a CRM that follows up are what make the directory's inquiries worth having.</li>
</ul>

<h2 id="compliance">Compliance notes</h2>
<div class="callout warn"><p><span class="lbl">Important:</span> a Psychology Today profile is advertising, and the same rules apply to it as to your website. No guarantees of outcomes, no "cure" language, no comparisons to other clinicians, no testimonials solicited from current clients (most licensing boards prohibit it), no identifiable client stories, and nothing in the Email Me flow that invites clinical detail into a non-HIPAA inbox. Route inquiries to a HIPAA-appropriate address, keep marketing tags off any page where a prospective client could disclose health information, and have your privacy officer or counsel review anything that touches patient data. We are a marketing company, not your compliance counsel.</p></div>

<h2 id="checklist">The checklist</h2>
<p>Work through it top to bottom. Each line maps to a gate, the card, the page or the measurement.</p>
<ul class="check">
<li>Real physical address entered; street hidden if shared or home</li>
<li>In Person and/or Online checked to match reality</li>
<li>Every state license entered; online listing live in each</li>
<li>All listing areas set; each zip checked for competition</li>
<li>Additional Location added where you genuinely serve clients</li>
<li>Participants and age groups all checked</li>
<li>Fee entered; sliding scale checked if offered</li>
<li>Every insurance panel checked; OON box if superbills</li>
<li>8 to 12 specialties; three starred after a competition check</li>
<li>Other Issues fields used for niches not on the list</li>
<li>Communities, faith, language, sexuality checked where competent</li>
<li>Availability status accurate; waitlist instead of deactivation</li>
<li>Photo 400×400+, face centered, warm, no logo</li>
<li>First 200 characters written to the client's problem</li>
<li>Box 1, 2, 3 at about 80% of limits, second person, no bare acronyms</li>
<li>Finance note states fee, insurance stance, free consult</li>
<li>Notes on specialties, therapy types, credentials filled</li>
<li>15-second vertical video uploaded with caption</li>
<li>Verified seal earned; endorsements requested from real colleagues</li>
<li>Email Me, Call Me and website link tested after every edit</li>
<li>Same-day reply standard, with CRM auto-acknowledgement</li>
<li>Scheduler shows availability before asking for details</li>
<li>Name, credential, city and phone consistent with site and GBP</li>
<li>Dashboard ratios recorded monthly; one change per 30 to 60 days</li>
<li>Every new client asked how they found you</li>
</ul>

<h2 id="faq">Questions clinicians ask us</h2>
<h3>Does editing my profile move it up?</h3>
<p>There is no "up." Order among qualifying profiles is randomized. Edits do not change your odds; qualifying for more searches does.</p>
<h3>Why do I see out-of-state therapists in my city's results?</h3>
<p>Because they are licensed in your state, have Online checked and are listed in your zip. That is allowed under the current terms as long as their address is real and their service type is accurate. Your answer is the same: be in more rotations, and win the card when your turn comes.</p>
<h3>Should I list in a bigger city nearby to get more views?</h3>
<p>Only if you serve clients there and can legitimately list an address or an online service area. More views in a 2,000-profile city rotation are fewer turns than you think, and the inquiries skew toward clients you cannot see. Smaller, well-matched zips usually produce more contacts per month.</p>
<h3>How many specialties should I check?</h3>
<p>Enough to qualify for the searches you want, few enough that a client believes all of them. For most practices that is eight to twelve, with three starred.</p>
<h3>Is the video worth the awkwardness?</h3>
<p>Yes. It gets you an extra placement on the results page and answers "do I like this person" in fifteen seconds. Most of your competitors have not recorded one.</p>
<h3>Is Psychology Today still worth $29.95 a month?</h3>
<p>If one client a year retains, yes, by a wide margin. Whether to list is the easy question. The harder one is whether your profile, your reply time and your intake process turn the views you get into clients.</p>
<h3>Can you do this for me?</h3>
<p>Yes. Profile optimization is part of our plans, for one clinician or an entire team, and we track it against contacts and admissions rather than views.</p>

<div class="band">
<h3>Want this handled by people who have run practices?</h3>
<p>We rewrite and structure Psychology Today profiles as part of a growth system that includes the website, CRM, intake automation and campaigns, with guarantees in writing. A working call, not a pitch.</p>
<a class="btn" href="__SCHEDULER_URL__" data-booking target="_blank" rel="noopener">Let's chat, book a 30-minute call<span class="sr-only"> about your Psychology Today profile</span></a>
</div>

<h2 id="refs">References</h2>
<ol class="refs">
<li id="r1">Psychology Today, live directory results pages and filter panel, October 2026. <a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener nofollow">psychologytoday.com/us/therapists</a></li>
<li id="r2">Psychology Today, zip-code results page showing exact-zip results, "More Therapists Nearby," "Nearby Searches" and card labels. <a href="https://www.psychologytoday.com/us/therapists/23187" target="_blank" rel="noopener nofollow">psychologytoday.com/us/therapists/23187</a></li>
<li id="r3">Psychology Today, About: "Unbiased Listings" and "Search With Confidence." <a href="https://about.psychologytoday.com/us/about.html" target="_blank" rel="noopener nofollow">about.psychologytoday.com</a></li>
<li id="r4">Trustpilot review by a licensed clinician relaying Psychology Today support's statement that results are randomized, January 2026. <a href="https://www.trustpilot.com/review/www.psychologytoday.com" target="_blank" rel="noopener nofollow">trustpilot.com</a></li>
<li id="r5">ClearHealthCosts, reporting on therapist-reported referral declines with Psychology Today spokesperson statements, December 2025 to March 2026. <a href="https://clearhealthcosts.com/blog/2026/03/more-therapists-express-concern-about-decline-in-psychology-today-referrals/" target="_blank" rel="noopener nofollow">clearhealthcosts.com</a></li>
<li id="r6">The Big Fish SEO, "How to Optimize Your Psychology Today Profile" and "Psychology Today Zip Code Strategy," 2026, quoting dashboard text on listing areas and teletherapy listings. <a href="https://www.thebigfishseo.com/blog/how-to-optimize-psychology-today-profile/" target="_blank" rel="noopener nofollow">thebigfishseo.com</a></li>
<li id="r7">TherapyEverywhere, "How Psychology Today Works," and Goodman Creatives, "How Does the Psychology Today Algorithm Work?" (1-in-40 illustration). <a href="https://therapyeverywhere.com/how-psychology-today-works/" target="_blank" rel="noopener nofollow">therapyeverywhere.com</a> · <a href="https://goodmancreatives.com/how-does-the-psychology-today-algorithm-work/" target="_blank" rel="noopener nofollow">goodmancreatives.com</a></li>
<li id="r8">Psychology Today, membership signup page: pricing, referral months, real-time data, protected phone number, Sessions. <a href="https://join.psychologytoday.com/us/signup" target="_blank" rel="noopener nofollow">join.psychologytoday.com/us/signup</a></li>
<li id="r9">Grow Therapy Help Center, "Psychology Today FAQ" (virtual addresses no longer allowed; additional locations). <a href="https://help.growtherapy.com/en/articles/6564627-psychology-today-faq" target="_blank" rel="noopener nofollow">help.growtherapy.com</a></li>
<li id="r10">Matthew Ryan LCSW, "How to Optimize Your Psychology Today Profile and Actually Get Client Calls" (one change at a time, 30 to 60 days). <a href="https://www.matthewryanlcsw.com/blog/how-to-optimize-your-psychology-today-profile-and-actually-get-client-calls" target="_blank" rel="noopener nofollow">matthewryanlcsw.com</a></li>
<li id="r11">Psychology Today, state online therapy listing pages, showing multi-state licensure stated in free text. <a href="https://www.psychologytoday.com/us/therapists/florida?category=online-counseling" target="_blank" rel="noopener nofollow">psychologytoday.com</a></li>
<li id="r12">Psychology Today Directory Terms of Use, effective March 23, 2026 (physical address, disclosure of service type, unique statements, no promotion of other clinicians). <a href="https://docs.psychologytoday.com/directory/terms/en/latest" target="_blank" rel="noopener nofollow">docs.psychologytoday.com/directory/terms</a></li>
<li id="r13">The Big Fish SEO, as above: Participants and Service Type fields, Profile Performance metrics, Group Practice feature, name-field warning.</li>
<li id="r14">Practice of the Practice, "Optimizing Your Psychology Today Profile with Aaron Price" (insurance box, generalist mistake, waitlist vs deactivation); Crownsville Media, "Psychology Today Profile Tips." <a href="https://practiceofthepractice.com/optimizing-your-psychology-today-profile-with-aaron-price-pop-1276/" target="_blank" rel="noopener nofollow">practiceofthepractice.com</a> · <a href="https://crownsvillemedia.com/psychology-today-profile-tips" target="_blank" rel="noopener nofollow">crownsvillemedia.com</a></li>
<li id="r15">Reframe Practice, "Psychology Today Profile Tips" and related guides with April 2026 editor screenshots (field limits, three Top Specialties, 80% target, competition check). <a href="https://reframepractice.com/answers/psychology-today/psychology-today-profile-tips" target="_blank" rel="noopener nofollow">reframepractice.com</a></li>
<li id="r16">First Session, "Psychology Today" resource (availability accuracy); McCance Method on availability notices. <a href="https://www.firstsession.com/resources/psychology-today" target="_blank" rel="noopener nofollow">firstsession.com</a></li>
<li id="r17">Kayla Das, "Maximize Reach: Psychology Today Profile" (click-rate and contact-rate definitions, 3 to 11% range). <a href="https://kayladas.com/maximize-reach-psychology-today-profile/" target="_blank" rel="noopener nofollow">kayladas.com</a></li>
<li id="r18">Reframe Practice, "Psychology Today Photo Tips for Therapists." <a href="https://reframepractice.com/answers/psychology-today/psychology-today-photo-tips-for-therapists" target="_blank" rel="noopener nofollow">reframepractice.com</a></li>
<li id="r19">The Private Practice Pro (Kelley Stevens), "3 Ways to Make Your Psychology Today Profile Convert." <a href="https://www.theprivatepracticepro.com/blog/3-ways-to-make-your-psychology-today-profile-convert" target="_blank" rel="noopener nofollow">theprivatepracticepro.com</a></li>
<li id="r20">Matthew Ryan LCSW, "Why Your Psychology Today Profile Stopped Working and How to Fix It (2026)." <a href="https://www.matthewryanlcsw.com/blog/why-your-psychology-today-profile-stopped-working-and-how-to-fix-it-2026" target="_blank" rel="noopener nofollow">matthewryanlcsw.com</a></li>
<li id="r21">SimplePractice, "Therapist Directory Profile"; Brighter Vision, "How to Optimize Your Psychology Today Profile" (snippet length estimates of roughly 200 to 250 characters). <a href="https://www.simplepractice.com/resource/therapist-directory-profile" target="_blank" rel="noopener nofollow">simplepractice.com</a> · <a href="https://www.brightervision.com/blog/how-to-optimize-your-psychology-today-profile/" target="_blank" rel="noopener nofollow">brightervision.com</a></li>
<li id="r22">Psychology Today, "What Does Verified by Psychology Today Mean?" <a href="https://www.psychologytoday.com/us/basics/therapy/what-does-verified-by-psychology-today-mean" target="_blank" rel="noopener nofollow">psychologytoday.com</a></li>
<li id="r23">TherapyEverywhere, "Psychology Today Intro Video" (limits and format). <a href="https://therapyeverywhere.com/psychology-today-intro-video/" target="_blank" rel="noopener nofollow">therapyeverywhere.com</a></li>
<li id="r24">The Private Practice Pro, "Psychology Today Video Feature." <a href="https://www.theprivatepracticepro.com/blog/psychology-today-video-feature" target="_blank" rel="noopener nofollow">theprivatepracticepro.com</a></li>
<li id="r25">The Counseling Palette, "Writing Your Psychology Today Profile"; Science Works Health, "Psychology Today Profile Tips." <a href="https://www.thecounselingpalette.com/post/writing-your-psychology-today-profile-let-s-role-play" target="_blank" rel="noopener nofollow">thecounselingpalette.com</a> · <a href="https://www.scienceworkshealth.com/post/psychology-today-profile-tips-therapist-how-to-attract-better-fit-clients" target="_blank" rel="noopener nofollow">scienceworkshealth.com</a></li>
<li id="r26">Mentaya, "How to Write a Psychology Today Profile" (test every link and button). <a href="https://mentaya.com/blog/how-to-write-a-psychology-today-profile" target="_blank" rel="noopener nofollow">mentaya.com</a></li>
<li id="r27">SonderMind, "Making the Most of Your First Message" (reply-time data). <a href="https://www.sondermind.com/private-practice/making-the-most-of-your-first-message/" target="_blank" rel="noopener nofollow">sondermind.com</a></li>
<li id="r28">Practice of the Practice, as above (scheduling link that gates the calendar).</li>
<li id="r29">Direct inspection of live Psychology Today profile pages (robots meta, canonical, title and meta-description patterns) and Google results for specialty-plus-city searches, October 2026; Psychology Today robots.txt. <a href="https://www.psychologytoday.com/robots.txt" target="_blank" rel="noopener nofollow">psychologytoday.com/robots.txt</a></li>
<li id="r30">Between Sessions, "How I Optimised My Psychology Today Profile" (Google page one in about three months). <a href="https://www.betweensessions.org/p/how-i-optimised-my-psychology-today" target="_blank" rel="noopener nofollow">betweensessions.org</a></li>
<li id="r31">TherapyDen, "5 Reasons to Cancel Your Psychology Today Listing" (website button redirect). <a href="https://www.therapyden.com/news/5-reasons-to-cancel-your-psychology-today-listing" target="_blank" rel="noopener nofollow">therapyden.com</a></li>
<li id="r32">Psychology.com, "Online Therapist Directory" practice guide (telehealth, Google Business Profile). <a href="https://psychology.com/practice-guides/online-therapist-directory" target="_blank" rel="noopener nofollow">psychology.com</a></li>
<li id="r33">Empathysites, "Putting the Verified Psychology Today Logo on Your Website." <a href="https://empathysites.com/putting-verified-psychology-today-logo-website-read/" target="_blank" rel="noopener nofollow">empathysites.com</a></li>
<li id="r34">Psychology Today, Psychiatrists directory city page with provider-type and specialty filters and price tiers. <a href="https://www.psychologytoday.com/us/psychiatrists/co/denver" target="_blank" rel="noopener nofollow">psychologytoday.com</a></li>
<li id="r35">Osmind, "Grow Your Psychiatry Private Practice: Reputation Management, Google Business Profile, Listings and Review Sites"; Headway, "Psychiatrist Bio Example." <a href="https://www.osmind.org/blog/grow-your-psychiatry-private-practice-reputation-management-google-business-profile-listing-and-review-sites" target="_blank" rel="noopener nofollow">osmind.org</a> · <a href="https://headway.co/resources/psychiatrist-bio-example" target="_blank" rel="noopener nofollow">headway.co</a></li>
<li id="r36">Secret-shopper study of psychiatrist availability (948 psychiatrists; 18.5% accepting; median wait 67 days in person, 43 telepsychiatry), PubMed ID 37290263, summarized by Ainora, 2026. <a href="https://ainora.lt/blog/therapy-intake-conversion-statistics-2026" target="_blank" rel="noopener nofollow">ainora.lt</a></li>
<li id="r37">Reframe Practice, "Psychology Today Cost Analysis"; r/therapists discussion, January 2026; SoftwarePundit survey. <a href="https://reframepractice.com/guides/psychology-today-cost-analysis" target="_blank" rel="noopener nofollow">reframepractice.com</a> · <a href="https://www.softwarepundit.com/node/421" target="_blank" rel="noopener nofollow">softwarepundit.com</a></li>
<li id="r38">ClearHealthCosts, January 2026 (an associate MFT's refresh test); Goodman Creatives, as above ("no official statement or verifiable proof"). <a href="https://clearhealthcosts.com/blog/2026/01/therapist-forums-buzzing-over-drop-in-psychology-today-referrals/" target="_blank" rel="noopener nofollow">clearhealthcosts.com</a></li>
<li id="r39">TherapyEverywhere, "Pros and Cons of Paying for More Than One Psychology Today Profile." <a href="https://therapyeverywhere.com/pros-and-cons-of-paying-for-more-than-one-psychology-today-profile/" target="_blank" rel="noopener nofollow">therapyeverywhere.com</a></li>
</ol>
<p><strong>Legal disclaimer:</strong> this guide is marketing and operational guidance, not legal, clinical or compliance advice. Platform features, field limits and policies change; confirm current details in your Psychology Today member dashboard and Terms of Use, and consult your licensing board and counsel on advertising rules in your jurisdiction.</p>

</article>`;

export const psychologyTodayGuide = {
  slug: "psychology-today-optimization-guide",
  title: "The Psychology Today Optimization Guide for Clinicians",
  metaTitle: "Psychology Today Profile Optimization Guide for Clinicians",
  metaDescription:
    "How the directory decides who a client sees, and the profile changes that move contacts. Written for therapists, psychologists and prescribers.",
  eyebrow: "Practice growth · Psychology Today",
  lede: "How the directory decides who a prospective client sees, why it works that way, and the profile changes that move the numbers. Written for therapists, psychologists, psychiatrists and PMHNPs by people who have owned practices and treatment centers.",
  published: "2026-10-29",
  updated: "2026-10-29",
  readingMinutes: 25,
  meta: ["October 2026", "About 25 minutes", "Sources numbered at the end"],
  body: BODY.replace(SCHEDULER_PLACEHOLDER, content.scheduler.embedUrl),
} as const;
