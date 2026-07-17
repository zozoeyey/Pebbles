# Pebbles — Tester Guide

Thanks for testing Pebbles! It's a web app (no download from an app store).
Please go through the sections below and note anything that looks broken, confusing,
or ugly. **Tell us your phone model + browser**, and screenshot anything weird.

**App link:** https://pebbles-sel.vercel.app

---

## 0. First: turn on "test mode" (do this once, after onboarding)

So your testing doesn't pollute our real usage stats:
- Go to the **Profile** tab (bottom right) → scroll to **APP** → check
  **"This is a test device — don't count my usage."**
- Sharing, likes, and reflections still fully work — this only hides your taps
  from our analytics.
- While you're there, note your **Anonymous ID** (e.g. `cozy-otter-421`) — if you
  hit a bug, send us that ID so we can find your data.

---

## 1. Install it to your Home Screen

**iPhone (Safari):**
1. Open the link in **Safari** (not Chrome — iOS only allows install from Safari).
2. Tap the **Share** button (square with an arrow) → **Add to Home Screen** → **Add**.
3. Open Pebbles from the new icon. It should run full-screen like a real app.

**Android (Chrome):**
1. Open the link in Chrome.
2. Tap the **⋮** menu → **Install app** (or **Add to Home screen**).
3. Open it from the icon.

✅ Check: the app icon is the Pebbles logo, and the app opens full-screen with no
browser address bar. The background should be one continuous cream color top to
bottom (no colored strips).

> Note: on iPhone, the installed app starts as a **fresh user** (Apple keeps
> installed-app data separate from Safari). That's expected — just onboard again
> inside the installed app.

---

## 2. Onboarding — and try to skip it

On first open you'll see **Welcome → child's age → what's hard → SEL questions**.

- [ ] On the age screen, tap **SKIP** in the top-right *before answering anything*.
      → It should **block you** with a friendly message and keep you on the page.
      (First-timers must finish onboarding.)
- [ ] Now go through it for real: pick an age, pick a challenge or two, answer the
      two short questions.
- [ ] After onboarding, a **guided tour** ("How Pebbles works") should walk you
      through the whole app with spotlights. Step through it — or hit **Skip tour**.

✅ Check: the tour highlights real things on screen (a suggested activity, the
video, the record button, Community, Toolkit, your profile pebble) and moves
between screens.

---

## 3. The main loop: find → do → reflect

- [ ] On **Explore**, you'll see **Suggested Activities** (picked for the age you
      entered) and **All Activities**.
- [ ] Try the **filter** button (top right) — filter by skill and by time.
- [ ] **Search** for an activity by name.
- [ ] **Bookmark** one (tap the ribbon icon) — it should later appear in Toolkit.
- [ ] Tap an activity → tap **Try Activity** → you're on its detail page.
- [ ] Watch the **Before You Begin** video (tap play).
- [ ] Tap **Start Activity** → the step-by-step player opens.
- [ ] Every activity now has **audio** — try the **Read / Listen** toggle at the
      top. In **Listen**, the steps should advance in sync with the narration.
- [ ] Tap the **✕ (Exit)** button top-right — it should jump you straight back to
      Explore (you don't have to back out step by step).
- [ ] Go back in and this time tap **Go to Reflection**.
- [ ] **Record** a voice note about how it went (talk for as long as you like) →
      it should come back as a short written summary.

✅ Check: audio steps stay in sync; the Exit button works from every screen; the
reflection summary reads like real notes (not a question or an error).

---

## 4. Sharing & Community

- [ ] After recording, tap **Share to Community** (or keep it private — your choice).
- [ ] If you shared, tap **See it in Community** → your post should appear at the
      **top**, labeled **"You"**.
- [ ] On the **Community** tab, use the **All Activities** dropdown to filter posts
      by activity.
- [ ] Tap a **heart** to like a post — then tap it again to **unlike**. The count
      should go up and back down.
- [ ] Tap **"See all for this activity →"** on a card → you're in that activity's
      thread. Try **replying** with text, and try a **voice reply**.

✅ Check: your shared post shows up; likes toggle on/off; replies appear under the
post.

---

## 5. Toolkit (your progress)

- [ ] Open the **Toolkit** tab. The **calendar** should have **today circled in
      pink**.
- [ ] Days where you recorded a reflection should be **blue**. Tap one → it shows
      what you did that day.
- [ ] Tap **today** → if you've done nothing yet, it nudges you to try an activity;
      once you've reflected, it lists it.
- [ ] Check the top stats: **Streak, Activities Tried, Reflections, Time Together** —
      these should reflect what you actually did.
- [ ] Your **bookmarked** activity from step 3 should be under **Saved Activities**.

---

## 6. Profile & memory

- [ ] On **Profile**, change the child's **age** or tap a different **challenge** →
      go back to **Explore** → the suggestions should re-tune.
- [ ] Type something in **"Anything else, in your words"** and press Enter → it
      becomes a removable chip.
- [ ] Tap **"How Pebbles works"** → the guided tour should replay.
- [ ] **Close the app completely and reopen it** → it should remember you and drop
      you on Explore (NOT make you re-onboard).

---

## 7. Poke at it / try to break it

- [ ] Rotate the phone / try a smaller phone if you have one — does anything get
      cut off or overlap?
- [ ] Tap around fast, hit Back and Exit in weird orders — does it get stuck?
- [ ] Leave a reflection recording without finishing — anything break?
- [ ] Anything that looks off: wrong colors, cut-off text, misaligned buttons,
      characters' eyes clipped, etc.

---

## What to send back

For each issue: **what screen**, **what you did**, **what happened vs. what you
expected**, a **screenshot**, and your **phone + browser** (e.g. "iPhone 13, Safari,
installed to Home Screen"). Your **Anonymous ID** from Profile helps too.

Thank you! 💛
