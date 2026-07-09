import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Compass,
  Factory,
  Gauge,
  Handshake,
  Lightbulb,
  MapPinned,
  Menu,
  Network,
  PanelsTopLeft,
  Play,
  Route,
  Scale,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  Users,
  Volume2,
  VolumeX,
  Workflow,
  X,
} from "lucide-react";
import "./styles.css";
import priyaImg from "./assets/priya.svg";

function playTone(type = "tap", enabled = true) {
  if (!enabled || typeof window === "undefined") return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const frequencies = type === "success" ? [660, 880] : [420];
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequencies[0], now);
  if (frequencies[1]) oscillator.frequency.setValueAtTime(frequencies[1], now + 0.08);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(type === "success" ? 0.045 : 0.025, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (type === "success" ? 0.18 : 0.09));
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + (type === "success" ? 0.2 : 0.1));
  oscillator.onended = () => context.close();
}

const stockImages = {
  intro: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
  priya: priyaImg,
  map: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  study: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  planning: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  roadmap: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  exam: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
  dashboard: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  process: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
  agile: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
  assessment: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  vocabulary: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80",
  governance: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  teamwork: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
  judgement: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
  finance: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
  risk: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d9?auto=format&fit=crop&w=1200&q=80",
  hierarchy: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  change: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
};

function imageForCard(card) {
  const title = card.title.toLowerCase();
  const text = `${card.title} ${card.preview || ""} ${card.body || ""}`.toLowerCase();
  if (title.includes("priya")) return stockImages.priya;
  if (title.includes("domain -> task") || title.includes("hierarchy")) return stockImages.hierarchy;
  if (title.includes("what changed")) return stockImages.change;
  if (title.includes("applied judgement") || title.includes("memorization")) return stockImages.judgement;
  if (title.includes("vocabulary") || text.includes("label") || text.includes("four labels")) return stockImages.vocabulary;
  if (title.includes("governance") || text.includes("compliance") || text.includes("business environment")) return stockImages.governance;
  if (title.includes("judgement") || title.includes("memorization") || text.includes("scenario")) return stockImages.judgement;
  if (title.includes("finance") || text.includes("cost")) return stockImages.finance;
  if (title.includes("risk")) return stockImages.risk;
  if (text.includes("stakeholder") || text.includes("people")) return stockImages.teamwork;
  if (text.includes("study")) return stockImages.study;
  if (title.includes("focus") || text.includes("planning") || text.includes("life-cycle")) return stockImages.roadmap;
  if (title.includes("eco") || title.includes("exam") || title.includes("hierarchy") || text.includes("task")) return stockImages.exam;
  if (title.includes("itto") || title.includes("process") || title.includes("chain")) return stockImages.process;
  if (title.includes("approach") || title.includes("agile") || title.includes("hybrid")) return stockImages.agile;
  if (title.includes("changed") || title.includes("judgement") || title.includes("score")) return stockImages.dashboard;
  if (title.includes("domain")) return stockImages.planning;
  return stockImages.map;
}

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.56, ease: [0.22, 1, 0.36, 1] },
  },
};

const swipeIn = {
  hidden: { opacity: 0, x: 42, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideObject = {
  hidden: { opacity: 0, y: 34, scale: 0.985, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { delay: 0.52, duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

const successUnlock = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 240, damping: 20 },
  },
};

const modalReveal = {
  hidden: { opacity: 0, y: 34, scale: 0.94, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 170, damping: 24, mass: 0.9 },
  },
  exit: {
    opacity: 0,
    y: 22,
    scale: 0.96,
    filter: "blur(6px)",
    transition: { duration: 0.24, ease: "easeIn" },
  },
};

const lensItems = [
  {
    key: "WHEN",
    title: "Focus Areas — the life-cycle spine of this course",
    preview: "Five stages: Initiating · Planning · Executing · M&C · Closing",
    body: "Focus Areas are PMBOK® 8's five life-cycle stages — Initiating, Planning, Executing, Monitoring & Controlling, and Closing.\n\nThey are the course's backbone. The modules follow them in order. They describe when work happens in the project — early vs. late, authorizing vs. closing.\n\nImportant: a Focus Area is not a rigid phase you finish and leave behind. On an agile project, Planning-type work recurs every iteration. Treat the order as a teaching sequence, not a law of nature.",
    exam: "The exam will place 'Planning' work in the middle of a delivery scenario. Don't be thrown — Focus Areas are types of activity, not calendar stages.",
    icon: PanelsTopLeft,
  },
  {
    key: "WHAT",
    title: "ECO Tasks & Enablers — what the exam actually tests",
    preview: "Three domains · 26 tasks · illustrative enablers",
    body: "The ECO is the only document the exam is actually written to. It is organized as Domain → Task → Enabler.\n\nEnablers are illustrative examples of what a task involves — not an exhaustive checklist. The exam can test the spirit of a task using a situation that no enabler names verbatim.\n\nStudy tasks for understanding. Read enablers for texture — to understand the flavour of a task, not to memorize its boundaries.",
    exam: "Don't memorize enablers as flashcards. Ask instead: if this task were tested in a scenario, what judgement would the exam want from me?",
    insight: "Priya tried to memorize every enabler and burned out fast. The reframe: a task is a responsibility. Enablers are just examples of what that responsibility looks like in action.",
    icon: ClipboardList,
  },
  {
    key: "WHERE",
    title: "Performance Domains — the seven areas of practice",
    preview: "Governance · Scope · Schedule · Finance · Stakeholders · Resources · Risk",
    body: "PMBOK® 8's seven performance domains organize the discipline by area of practice.\n\nThey are Governance, Scope, Schedule, Finance, Stakeholders, Resources, and Risk.\n\nKey change from older editions: Governance replaced Integration; Finance replaced Cost; Quality, Communications, and Procurement were folded into the seven rather than standing alone.\n\nA domain (WHERE) and a Focus Area (WHEN) are independent axes. One domain spans multiple Focus Areas. One Focus Area draws from multiple domains.",
    exam: "If you trained on older PMBOK material — this remapping of Quality, Communications, and Procurement is the most common source of confusion. The course flags it wherever it bites.",
    icon: Network,
  },
  {
    key: "HOW",
    title: "Processes & ITTOs — the mechanics of how work gets done",
    preview: "40 non-prescriptive processes · Inputs → Tools & Techniques → Outputs",
    body: "PMBOK® 8's 40 non-prescriptive processes are embedded inside the seven domains. Each is expressed as an ITTO — Inputs, Tools & Techniques, and Outputs.\n\n'Non-prescriptive' matters. PMBOK® 8 shows the common way a process runs but expects you to tailor it.\n\nThe trick: read each ITTO box as a sentence. 'Take these inputs, apply these tools, get this output.' One output of one process is almost always an input to the next.",
    exam: "The exam rarely asks you to recite an ITTO list. It tests the logic of the chain — which input is missing, which tool produces this output, what to do with this output next.",
    insight: "Priya's first instinct was to flashcard every input and output. Within a week she had 200 cards and no understanding. The fix: for each process she writes one sentence that captures the transformation.",
    icon: Workflow,
  },
];

const focusAreas = [
  { title: "Initiating", module: "Module 2", body: "The work that authorizes and frames the project: why it exists, who matters, and what must be started well.", icon: Play },
  { title: "Planning", module: "Module 3", body: "The heaviest course area: scope, schedule, finance, resources, risk, stakeholders, and governance are shaped here.", icon: MapPinned },
  { title: "Executing", module: "Module 4", body: "The work of leading people and delivering outputs while keeping resources, stakeholders, scope, and risk aligned.", icon: Workflow },
  { title: "Monitoring & Controlling", module: "Module 5", body: "The work of measuring, comparing, responding, forecasting, and protecting value while delivery is underway.", icon: Gauge },
  { title: "Closing", module: "Module 6", body: "The work of formal completion, transition, financial closure, accepted scope, and organizational learning.", icon: Check },
];

const sections = [
  {
    eyebrow: "Lesson Overview",
    title: "Lesson Overview",
    subtitle: "Before you study a single process, you need to know how this course is organised — and why each lesson speaks four languages at once. Master this map now and every later lesson reads faster.",
    cards: [
      {
        title: "What You'll Learn",
        points: [
          "How Focus Areas, ECO Tasks, Performance Domains, and Processes fit together — four complementary views of one project.",
          "How to read the ITTO reference boxes in each lesson — treating inputs, tools, and outputs as logic, not lists to memorize.",
          "The three development approaches — predictive, agile, and hybrid — as one certainty spectrum, and how the exam weights them.",
          "How to run an honest self-assessment — so your study hours flow to your widest gaps first.",
        ],
      },
    ],
    anchor: "Start Section 1 — Overview.",
  },
  {
    eyebrow: "Section 1",
    title: "Why Four Vocabularies?",
    subtitle: "There is only one project. Everything else — Focus Areas, ECO tasks, performance domains, processes — is a different lens pointed at that same project. New candidates lose weeks treating four labels as four separate bodies of knowledge. They are not.",
    icon: Compass,
    type: "modal",
    cards: [
      {
        title: "There Is Only One Project",
        preview: "There is only one project. Four lenses. Four questions. Same work.",
        body: "PMI maintains two distinct documents this course serves simultaneously.\n\nThe PMBOK® Guide describes the discipline — principles, areas of practice, and processes. The ECO describes the job — the tasks a competent project manager performs.\n\nThe exam is written to the ECO. The knowledge that answers it lives in PMBOK® 8. A serious course teaches both at once — and shows you the join.",
        exam: "Don't double-study. Once you see where the ECO and PMBOK® 8 connect, you stop treating them as separate subjects.",
        insight: "Once Priya's mentor showed her this, she stopped memorizing four separate lists and started asking one question: which question is this label answering?",
      },
      {
        title: "Priya's Breakthrough",
        preview: "Four labels. One activity. Once you see it, every lesson reads faster.",
        body: "Priya was trying to memorize four lists when she only needed to place four labels.\n\nThe Focus-Area tag tells her this is Planning-stage work. The ECO block tells her what judgement the exam will test. The domain note tells her what area of practice it belongs to. The ITTO box tells her what goes in and what comes out.\n\nFour labels. One activity. Four different answers to four different questions about the same work.",
        exam: "She stopped asking 'what does this label mean?' and started asking 'which question is this label answering?' The page stopped being a wall of jargon.",
      },
    ],
    anchor: "The ECO names the competency outcome (WHAT). PMBOK® 8 supplies the process and domain (HOW and WHERE). The Focus Area supplies the timing (WHEN). The exam is written to the ECO — you answer it with PMBOK® 8 knowledge. Learn to see the join and you stop double-studying.",
  },
  {
    eyebrow: "Section 2",
    title: "The Four Lenses",
    subtitle: "Every lesson in this course speaks four languages. Here's what each one is doing — and the single question each one answers.",
    icon: Route,
    type: "lens-figure",
    cards: lensItems,
    anchor: "One project, four lenses: Focus Areas (when), ECO tasks & enablers (what is tested), performance domains (where), and processes/ITTO (how).",
  },
  {
    eyebrow: "Section 2",
    title: "Explore the Four Lenses",
    subtitle: "Now click through each lens to see what it does and how to use it when studying.",
    icon: Route,
    type: "lenses",
    cards: lensItems,
    anchor: "Four lenses, four questions. WHEN = Focus Areas. WHAT = ECO Tasks & Enablers. WHERE = Performance Domains. HOW = Processes & ITTOs. Hold those four questions and the densest lesson page becomes navigable.",
  },
  {
    eyebrow: "Section 3",
    title: "Focus Areas",
    subtitle: "Focus Areas are the spine of this course. PMBOK® 8 reintroduced the five familiar life-cycle groupings — once called Process Groups — under a new name. The course is built module-by-module along that spine, so your study follows the same arc a real project does.",
    icon: PanelsTopLeft,
    type: "focus",
    cards: [
      {
        title: "Focus Areas Are Types of Activity — Not Rigid Phases",
        preview: "On agile projects, Planning-type work recurs every iteration.",
        body: "PMBOK® 8 treats the five as flexible categories of activity, not sequential gates.\n\nOn an agile or hybrid project you re-plan every iteration, so Planning-type work recurs throughout. You execute and monitor continuously and in parallel.\n\nThe course presents them in order because that is the clearest way to learn. But the exam will happily place Planning work in the middle of a delivery scenario.",
        exam: "Rule out any answer that treats Focus Areas as rigid sequential stages. In adaptive scenarios, the iterative answer is right.",
      },
      {
        title: "Focus Area vs. Performance Domain",
        preview: "One Focus Area — like Planning — touches many performance domains at once.",
        body: "A performance domain is WHERE work lives. A Focus Area is WHEN it happens. They are orthogonal — independent of each other.\n\nThe Schedule domain, for example, has work that happens during Planning (build and baseline), during Executing and Monitoring & Controlling (analyse variance, re-forecast), and during Closing (final reconciliation).\n\nConversely, the Planning Focus Area pulls work from almost every domain at once.\n\nA single process sits at the intersection of one performance domain and one Focus Area.",
        exam: "Exam questions often probe this distinction. Know that one domain spans multiple Focus Areas — and one Focus Area draws from multiple domains.",
      },
    ],
    anchor: "Focus Area = WHEN (life-cycle timing). Five: Initiating → Planning → Executing → Monitoring & Controlling → Closing. They are the course modules. Do not confuse a Focus Area (when) with a performance domain (where) — they are independent axes.",
  },
  {
    eyebrow: "Section 4",
    title: "ECO Tasks & Enablers",
    subtitle: "The ECO is the only document the exam is actually written to. Understanding its three-level hierarchy — Domain → Task → Enabler — is the difference between studying the right things and drowning in detail.",
    icon: ClipboardList,
    type: "eco",
    cards: [
      {
        title: "The Domain -> Task -> Enabler Hierarchy",
        preview: "Three levels. The level that trips people up is the enabler — and it's the most misunderstood word in the ECO.",
        body: "A Domain is a high-level area of knowledge — there are three. A Task is a specific responsibility within a domain — there are 26 in total. An Enabler is an illustrative example of the work a task involves.\n\nThe most misunderstood word: illustrative. PMI is explicit — enablers are not an exhaustive list. They are windows into the kind of judgement each task demands.\n\nPMI uses those windows to engineer exam questions. It takes a task, selects an enabler, and dramatizes it into a realistic scenario.",
        exam: "Study tasks for understanding. Read enablers for texture — not as a checklist to memorize.",
        insight: "Priya switched from memorizing enablers to asking, for each task: 'if a scenario tested this, what judgement would it want from me?' Her practice scores went up immediately.",
      },
      {
        title: "What Changed for 2026",
        preview: "35 tasks became 26. That does not mean less content.",
        body: "The task count fell from 35 (2021) to 26 (2026). It is tempting to read this as 'less to study.' That reading is wrong.\n\nPMI consolidated overlapping tasks into broader statements and widened the enablers beneath each one. The total volume of testable knowledge is comparable. Independent estimates put the carry-over of existing content at around 85% or more.\n\nTopics also moved domains. Governance, compliance, change control, and risk management all migrated into the enlarged Business Environment domain. Finance was promoted to its own dedicated Process task.",
        exam: "Learn the 2026 map as it is — not as the old one was. A governance question is now a Business Environment question, even if it touches process work.",
      },
      {
        title: "Applied Judgement — Not Memorization",
        preview: "Recall gets you into the room. Judgement wins the question.",
        body: "The ECO is explicit: candidates must apply project management concepts to on-the-job situations through scenario-based questions. The exam tests what you would do — not what you can recite.\n\nQuestions lean on qualifiers that demand a comparison among defensible options: FIRST, BEST, MOST APPROPRIATE. These words tell you that more than one option is reasonable — and you are being asked to rank, not recall.\n\nThe PMI-principled instinct — engage people before escalating, understand a problem before solving it, protect value over just hitting a date — is almost always the discriminator.",
        exam: "When two answers both look right, the one that involves engaging people first, understanding the situation, or protecting value is usually the principled answer.",
      },
    ],
    anchor: "ECO hierarchy: Domain → Task → Enabler. Three domains (People 33% · Process 41% · Business Environment 26%), 26 tasks total. Enablers are illustrative — never a checklist. The exam is written to the ECO. You answer it with PMBOK® 8 knowledge.",
  },
  {
    eyebrow: "Section 5",
    title: "Performance Domains & ITTOs",
    subtitle: "If Focus Areas are WHEN and ECO tasks are WHAT, performance domains are WHERE the work lives and ITTOs are HOW it gets done. Here's how to use both.",
    icon: Network,
    type: "itto",
    cards: [
      {
        title: "The Seven Performance Domains",
        preview: "Governance replaced Integration. Finance replaced Cost.",
        body: "PMBOK® 8's seven domains: Governance, Scope, Schedule, Finance, Stakeholders, Resources, and Risk.\n\nTwo vocabulary changes to commit to memory. First: Governance replaced Integration, and Finance replaced Cost — a deliberate broadening of what each area covers. Second: Quality, Communications, and Procurement are no longer standalone domains — their content is distributed into the seven.\n\nIf you trained on older material, this remapping is the most common source of confusion. The course flags it wherever it shows up.",
        exam: "Do not look for a Communications domain. Communication content lives inside Stakeholders and Governance now.",
      },
      {
        title: "How to Read an ITTO Reference Box",
        preview: "Read it as a sentence. The chain is what the exam tests.",
        body: "Inputs are what a process consumes — plans, baselines, data, and the enterprise environmental factors and organizational process assets that inform it.\n\nTools & Techniques are how the work is done — expert judgment, estimating techniques, data analysis, meetings.\n\nOutputs are what the process produces — a plan, a baseline, or an updated artifact.\n\nThe trick: read it as a sentence. 'Take these inputs, apply these tools, get this output.' An output of one process is almost always an input to the next — that's how the whole project chains together.",
        exam: "The exam rarely asks you to recite an ITTO. It tests the logic of the chain — which input is missing, which tool produces this output, what to do with this output next.",
        insight: "Priya dropped from 200 flashcards to 40 one-sentence summaries and her scores went up. The chain is what matters.",
      },
      {
        title: "One Lesson, Four Connections",
        preview: "Schedule planning, seen four ways at once.",
        body: "Every lesson in this course names four things: its Focus Area (WHEN), its ECO task (WHAT), its performance domain (WHERE), and its process with ITTO (HOW).\n\nHere's Lesson 3.3 — Schedule Planning — seen through all four lenses at once.\n\nFOCUS AREA / WHEN: Lesson 3.3 sits here → Planning\n\nECO TASK / WHAT: Exam tests → Process Task 8: Plan and manage schedule\n\nPERFORMANCE DOMAIN / WHERE: Work lives in → Schedule Domain\n\nPROCESS / HOW: Mechanism is → Develop Schedule (ITTO)",
        exam: "When a lesson page feels dense, name its four threads and it resolves into one activity seen four ways.",
      },
    ],
    anchor: "Seven performance domains (where): Governance, Scope, Schedule, Finance, Stakeholders, Resources, Risk. Governance replaced Integration; Finance replaced Cost; Quality/Communications/Procurement folded in. Read ITTO boxes as a sentence — consume → transform → produce. The exam tests the logic of the chain.",
  },
  {
    eyebrow: "Section 6",
    title: "The Three Development Approaches",
    subtitle: "Predictive, agile, and hybrid are not three separate subjects. They are three points on one spectrum. The 2026 exam threads all three through every domain — and this is the thing most older study guides get wrong.",
    icon: SlidersHorizontal,
    type: "approach",
    cards: [
      {
        title: "There Is No Isolated Agile Section",
        preview: "Agile thinking appears inside leadership, risk, stakeholder, and governance questions.",
        body: "PMI is explicit: the three approaches are found throughout all three ECO domains. They are not isolated to any task or section.\n\nAgile thinking shows up inside leadership questions, risk questions, stakeholder questions, and governance questions.\n\nA single scenario may run predictive compliance work and agile feature delivery side by side — and ask how you would manage the seam.\n\nModule 7 of this course goes deep on agile and hybrid. But don't wait until Module 7 to start thinking adaptively — it's threaded through Modules 3 through 6 as well.",
        exam: "When unsure between two answers, the iterative, value-protecting, people-first move is usually the principled one — regardless of which domain the question is testing.",
      },
      {
        title: "Hybrid — the Most Common Real-World Approach",
        preview: "Different parts of the same project can sit at different certainty levels.",
        body: "Hybrid means different parts of the same project sit at different points on the certainty spectrum.\n\nThe Bloom Foods pilot — Olivia Johnson's 12-store loyalty app, $470k, hybrid delivery — runs predictive for its compliance and governance work and adaptive for its feature development.\n\nThat's the reality of most modern projects. The exam is built to reflect it.\n\nWhen you encounter the Bloom case study throughout this course, watch for moments where Olivia has to manage the seam between a predictive envelope and adaptive delivery inside it.",
        exam: "Hybrid scenarios are among the most commonly tested. Practice recognizing which part of the project is which — and what the right approach is at each seam.",
      },
    ],
    anchor: "One spectrum, three points: predictive ↔ hybrid ↔ adaptive/agile. Decide the approach first — it is an input to every domain. The 2026 exam runs all three through every domain (≈40% predictive, ≈60% adaptive + hybrid). There is no isolated agile section.",
  },
  {
    eyebrow: "Section 7",
    title: "Self-Assessment",
    subtitle: "Study time is your scarcest resource. Spend it on gaps, not comfort.",
    icon: Target,
    type: "assessment",
    anchor: "Find your widest gaps, weight them by exam share, and let the widest, heaviest gaps claim your next study block.",
  },
  {
    eyebrow: "Section 7",
    title: "Full Course Crosswalk",
    subtitle: "Every row is one Focus Area — one WHEN. Read across to see which ECO domains it draws on and which performance domains and processes carry the work.",
    icon: Route,
    type: "crosswalk",
    anchor: "The course spine crosses ECO domains (WHAT) with PMBOK® 8 Focus Areas (WHEN), so every later lesson sits at one intersection.",
  },
  {
    eyebrow: "Section 7",
    title: "Exam Lens & Framework Crosswalk",
    subtitle: "Use the final crosswalk as your orientation map whenever a later lesson feels dense.",
    icon: Lightbulb,
    type: "exam-framework",
    anchor: "The join to remember: the ECO names the competency outcome; PMBOK® 8 supplies the process and the domain; the Focus Area supplies the timing.",
  },
];

const lessonList = [
  "Lesson Overview",
  "Why Four Vocabularies?",
  "The Four Lenses",
  "Explore the Four Lenses",
  "Focus Areas",
  "ECO Tasks & Enablers",
  "Performance Domains & ITTOs",
  "The Three Development Approaches",
  "Self-Assessment",
  "Full Course Crosswalk",
  "Exam Lens",
];

const sectionGroups = [
  { label: "Overview", start: 0 },
  { label: "Lenses", start: 2 },
  { label: "Focus Areas", start: 4 },
  { label: "ECO Tasks", start: 5 },
  { label: "Domains", start: 6 },
  { label: "Approaches", start: 7 },
  { label: "Reference", start: 8 },
];

function ProgressDot({ state = "idle" }) {
  return (
    <span className={`progress-dot ${state}`} aria-hidden="true">
      {state === "done" ? <Check size={10} strokeWidth={3} /> : <span />}
    </span>
  );
}

function TopBar({ soundOn, onToggleSound }) {
  const dots = Array.from({ length: 19 }, (_, index) =>
    index === 0 ? "done" : index === 1 ? "active" : "idle",
  );

  return (
    <header className="topbar">
      <button className="course-select" type="button" aria-label="Select certificate">
        <Award size={24} />
        <span>PMP Project Management Professional</span>
        <ChevronDown size={20} />
      </button>

      <div className="module-progress" aria-label="Course progress">
        <div>{dots.slice(0, 10).map((state, index) => <ProgressDot key={index} state={state} />)}</div>
        <div>{dots.slice(10).map((state, index) => <ProgressDot key={index + 10} state={state} />)}</div>
      </div>

      <div className="top-actions">
        <button className="ghost-button" type="button" onClick={onToggleSound} aria-pressed={soundOn} aria-label={soundOn ? "Turn sound off" : "Turn sound on"}>
          {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          <span>{soundOn ? "Sound on" : "Sound off"}</span>
        </button>
        <button className="ghost-button" type="button">
          <X size={20} />
          <span>Quit</span>
        </button>
      </div>
    </header>
  );
}

function SectionTabs({ groups, totalSections, activeIndex, completed, isReachable, onSelect }) {
  const boundaries = groups.map((group, index) => ({
    ...group,
    end: index + 1 < groups.length ? groups[index + 1].start - 1 : totalSections - 1,
  }));
  const activeGroupIndex = boundaries.findIndex((group) => activeIndex >= group.start && activeIndex <= group.end);

  return (
    <nav className="section-tabs" aria-label="Lesson sections">
      <p className="section-tabs-count">Section {activeGroupIndex + 1} of {boundaries.length}</p>
      <div className="section-tabs-row">
        {boundaries.map((group, index) => {
          const done = completed.slice(group.start, group.end + 1).every(Boolean);
          const isActive = index === activeGroupIndex;
          const reachable = isReachable(group.start);
          return (
            <button
              key={group.label}
              type="button"
              className={`section-tab ${isActive ? "active" : done ? "done" : "locked"}`}
              onClick={() => reachable && onSelect(group.start)}
              disabled={!reachable}
            >
              {done && !isActive ? <Check size={14} /> : null}
              <span>{group.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function InteractionStatus({ done, total }) {
  const isComplete = done >= total;
  return (
    <motion.div className={isComplete ? "interaction-status complete" : "interaction-status"} role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} animate={isComplete ? { scale: [1, 1.015, 1] } : { scale: 1 }} transition={{ duration: 0.32 }}>
      <span>{done} of {total} completed</span>
      <div><span style={{ width: `${Math.min(100, (done / total) * 100)}%` }} /></div>
    </motion.div>
  );
}

function IntroInteraction({ section, onComplete }) {
  useEffect(() => { onComplete(); }, [onComplete]);
  return (
    <motion.div className="intro-screen" variants={stagger} initial="hidden" animate="show">
      <motion.section className="priya-panel" variants={fadeUp}>
        <img src={stockImages.priya} alt="" />
        <div>
          <p className="mini-label">Priya · Making Sense of It</p>
          <h3>Four labels for one activity</h3>
          <p>
            Priya is a project coordinator on the Bloom Foods pilot preparing for her PMP exam. She sits down to study scheduling and finds herself completely lost — not because schedule planning is hard, but because the page is covered in labels she can't place.
          </p>
          <p>
            Focus Area tag. ECO Reference block. Performance Domain note. ITTO box. Four labels for one activity. This lesson is where that confusion resolves.
          </p>
        </div>
      </motion.section>
      <motion.section className="intro-block" variants={fadeUp}>
        <div>
          <h3>What You'll Learn</h3>
          <ul>{section.cards[0].points.map((point) => <li key={point}>{point}</li>)}</ul>
        </div>
        <div className="intro-block-icon"><Target size={22} /></div>
      </motion.section>
    </motion.div>
  );
}

function SlideModal({ card, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
  if (!card) return null;
  return createPortal(
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} onClick={onClose}>
      <motion.article className="slide-modal" variants={modalReveal} initial="hidden" animate="show" exit="exit" onClick={(event) => event.stopPropagation()}>
        <button className="drawer-close" type="button" onClick={onClose} aria-label="Close"><X size={22} /></button>
        <motion.div className="modal-editorial" variants={stagger} initial="hidden" animate="show">
          <motion.img className={imageForCard(card) === stockImages.priya ? "modal-image modal-image-illustration" : "modal-image"} src={imageForCard(card)} alt="" variants={fadeUp} />
          <motion.p className="mini-label" variants={fadeUp}>Detail</motion.p>
          <motion.h3 variants={fadeUp}>{card.title}</motion.h3>
          <motion.p variants={fadeUp}>{card.body}</motion.p>
          <motion.div className="exam-lens compact" variants={fadeUp}><Lightbulb size={18} /><span>{card.exam}</span></motion.div>
          {card.insight && <motion.div className="priya-insight" variants={fadeUp}><strong>Priya's insight:</strong><span>{card.insight}</span></motion.div>}
        </motion.div>
        <motion.button className="modal-close-bottom" type="button" onClick={onClose} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.32 }}><Check size={18} /> Mark as read</motion.button>
      </motion.article>
    </motion.div>,
    document.body,
  );
}

function CardModalInteraction({ section, onComplete, soundOn }) {
  const [active, setActive] = useState(null);
  const [visited, setVisited] = useState(new Set());
  useEffect(() => { if (visited.size >= section.cards.length) onComplete(); }, [visited, section.cards.length, onComplete]);
  const open = (card) => {
    playTone("tap", soundOn);
    setActive(card);
    setVisited((items) => new Set(items).add(card.title));
  };
  return (
    <motion.div className="modal-activity" variants={stagger} initial="hidden" animate="show">
      <motion.div className="activity-instruction" variants={fadeUp}><Sparkles size={18} /><span>Open each learning card to continue.</span></motion.div>
      <motion.div className={section.cards.length === 2 ? "card-grid two-card-grid" : "card-grid"} variants={stagger}>
        {section.cards.map((card, index) => {
          const isOrange = section.cards.length === 2 && index === 1;
          const isVisited = visited.has(card.title);
          return (
          <motion.button className={`${isVisited ? "grid-learn-card viewed" : "grid-learn-card"} ${isOrange ? "orange-card" : ""}`} type="button" key={card.title} onClick={() => open(card)} variants={fadeUp} whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }}>
            <img className="grid-card-image" src={imageForCard(card)} alt="" />
            <div className={`grid-card-icon ${isVisited ? "green" : isOrange ? "orange" : "blue"}`}>{isVisited ? <Check size={26} /> : <Search size={26} />}</div>
            <strong>{card.title}</strong>
            <small>{card.preview}</small>
            <em>{isVisited ? "Viewed" : "Explore"} <ArrowRight size={14} /></em>
          </motion.button>
          );
        })}
      </motion.div>
      <InteractionStatus done={visited.size} total={section.cards.length} />
      <AnimatePresence>{active && <SlideModal card={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </motion.div>
  );
}

function LensFigure({ section, onComplete }) {
  useEffect(() => { onComplete(); }, [onComplete]);
  const figureItems = [
    ["WHEN?", "Focus Areas", "The five life-cycle stages — Initiating, Planning, Executing, M&C, Closing", PanelsTopLeft],
    ["WHAT?", "ECO Tasks & Enablers", "Three domains, 26 tasks, illustrative enablers — the exam blueprint", ClipboardList],
    ["WHERE?", "Performance Domains", "Seven areas of practice — Governance, Scope, Schedule, Finance, Stakeholders, Resources, Risk", Network],
    ["HOW?", "Processes & ITTOs", "40 non-prescriptive processes — Inputs → Tools & Techniques → Outputs", Workflow],
  ];

  return (
    <motion.section className="lens-figure" variants={stagger} initial="hidden" animate="show">
      <motion.div className="lens-figure-head" variants={fadeUp}>
        <p className="mini-label">One Project — Four Lenses</p>
        <h3>Each lens answers a different question about the same work</h3>
      </motion.div>
      <motion.div className="lens-grid" variants={stagger}>
        {figureItems.map(([key, title, preview, Icon]) => {
          return (
            <motion.article key={key} variants={fadeUp} whileHover={{ y: -3 }}>
              <span className="lens-icon"><Icon size={28} /></span>
              <small>{key}</small>
              <strong>{title}</strong>
              <p>{preview}</p>
            </motion.article>
          );
        })}
      </motion.div>
      <motion.p className="figure-caption" variants={fadeUp}>Figure 0.5.a — One project, four lenses: Focus Areas (when), ECO tasks & enablers (what is tested), performance domains (where), and processes/ITTO (how).</motion.p>
    </motion.section>
  );
}

function LensSelector({ section, onComplete, soundOn }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visited, setVisited] = useState(new Set([0]));
  const active = section.cards[activeIndex];
  const ActiveIcon = active.icon;
  const [activeHeading, activeSubtitle] = active.title.split(" — ");
  useEffect(() => { if (visited.size >= section.cards.length) onComplete(); }, [visited, section.cards.length, onComplete]);
  const select = (index) => {
    playTone("tap", soundOn);
    setActiveIndex(index);
    setVisited((items) => new Set(items).add(index));
  };
  return (
    <div className="lens-experience">
      <motion.div className="module-explorer" variants={stagger} initial="hidden" animate="show">
        <motion.aside className="module-list" aria-label="Four lens selector" variants={stagger}>
          {section.cards.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button className={`${index === activeIndex ? "active" : ""} ${visited.has(index) ? "visited" : ""}`} type="button" key={item.key} onClick={() => select(index)} variants={swipeIn} whileHover={{ x: 4 }} whileTap={{ scale: 0.985 }}>
                <span className="module-list-icon">{visited.has(index) ? <Check size={22} /> : <Icon size={22} />}</span>
                <span><small>{item.key}</small><strong>{item.title.split(" — ")[0]}</strong></span>
              </motion.button>
            );
          })}
        </motion.aside>
        <AnimatePresence mode="wait">
          <motion.article key={active.key} className={visited.has(activeIndex) ? "module-detail visited" : "module-detail"} initial={{ opacity: 0, x: 34, filter: "blur(5px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -24, filter: "blur(4px)" }} transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}>
            <ActiveIcon className="module-detail-icon" size={76} strokeWidth={1.8} />
            <p className="mini-label">{active.key}</p>
            <h3>{activeHeading}</h3>
            {activeSubtitle && <p className="detail-subtitle">{activeSubtitle}</p>}
            <p>{active.body}</p>
            <h4>Use this lens when studying:</h4>
            <div className="module-bullet-list">
              <div><span>&bull;</span><strong>{active.preview}</strong></div>
              <div><span>&bull;</span><strong>{active.exam}</strong></div>
            </div>
            {active.insight && <div className="priya-insight"><strong>Priya's insight:</strong><span>{active.insight}</span></div>}
          </motion.article>
        </AnimatePresence>
        <InteractionStatus done={visited.size} total={section.cards.length} />
      </motion.div>
    </div>
  );
}

function FocusAreaInteraction({ section, onComplete, soundOn }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visited, setVisited] = useState(new Set([0]));
  const [activeCard, setActiveCard] = useState(null);
  const [visitedCards, setVisitedCards] = useState(new Set());
  const active = focusAreas[activeIndex];
  const total = focusAreas.length + section.cards.length;
  const done = visited.size + visitedCards.size;
  useEffect(() => { if (done >= total) onComplete(); }, [done, total, onComplete]);
  const select = (index) => {
    playTone("tap", soundOn);
    setActiveIndex(index);
    setVisited((items) => new Set(items).add(index));
  };
  const openCard = (card) => {
    playTone("tap", soundOn);
    setActiveCard(card);
    setVisitedCards((items) => new Set(items).add(card.title));
  };
  const Icon = active.icon;
  return (
    <motion.div className="module-explorer focus-module" variants={stagger} initial="hidden" animate="show">
      <motion.aside className="module-list" aria-label="Focus area selector" variants={stagger}>
        {focusAreas.map((item, index) => {
          const ItemIcon = item.icon;
          return (
            <motion.button className={`${index === activeIndex ? "active" : ""} ${visited.has(index) ? "visited" : ""}`} type="button" key={item.title} onClick={() => select(index)} variants={swipeIn} whileHover={{ x: 4 }} whileTap={{ scale: 0.985 }}>
              <span className="module-list-icon">{visited.has(index) ? <Check size={22} /> : <ItemIcon size={22} />}</span>
              <span><small>{item.module}</small><strong>{item.title}</strong></span>
            </motion.button>
          );
        })}
      </motion.aside>
      <AnimatePresence mode="wait">
        <motion.article key={active.title} className="module-detail visited" initial={{ opacity: 0, x: 34, filter: "blur(5px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -24, filter: "blur(4px)" }} transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}>
          <Icon className="module-detail-icon" size={76} strokeWidth={1.8} />
          <p className="mini-label">The Five Focus Areas</p>
          <h3>{active.title}</h3>
          <p>{active.body}</p>
          <h4>The two things about Focus Areas that most candidates get wrong:</h4>
          <div className="mini-card-stack">
            {section.cards.map((card) => (
              <button className={visitedCards.has(card.title) ? "mini-learn-card viewed" : "mini-learn-card"} type="button" key={card.title} onClick={() => openCard(card)}>
                <strong>{card.title}</strong>
                <span>{card.preview}</span>
                <em>{visitedCards.has(card.title) ? "Viewed" : "Open"} <ArrowRight size={14} /></em>
              </button>
            ))}
          </div>
        </motion.article>
      </AnimatePresence>
      <AnimatePresence>{activeCard && <SlideModal card={activeCard} onClose={() => setActiveCard(null)} />}</AnimatePresence>
      <InteractionStatus done={done} total={total} />
    </motion.div>
  );
}

function EcoInteraction(props) {
  return (
    <div className="eco-experience">
      <motion.div className="eco-stats" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} whileHover={{ y: -3 }}><Users className="eco-stat-icon" size={28} /><strong>People</strong><span>33%</span><small>8 tasks</small></motion.div>
        <motion.div variants={fadeUp} whileHover={{ y: -3 }}><Workflow className="eco-stat-icon" size={28} /><strong>Process</strong><span>41%</span><small>10 tasks · largest domain</small></motion.div>
        <motion.div variants={fadeUp} whileHover={{ y: -3 }}><BriefcaseBusiness className="eco-stat-icon" size={28} /><strong>Business Env.</strong><span>26%</span><small>8 tasks · tripled in 2026</small></motion.div>
      </motion.div>
      <CardModalInteraction {...props} />
    </div>
  );
}

function IttoInteraction(props) {
  return (
    <div className="itto-experience">
      <div className="itto-flow">
        <div><strong>Inputs</strong><span>Plans, data, EEFs, OPAs</span></div>
        <ArrowRight size={28} />
        <div><strong>Tools & Techniques</strong><span>Judgment, estimating, analysis, meetings</span></div>
        <ArrowRight size={28} />
        <div><strong>Outputs</strong><span>Plan, baseline, updated artifact</span></div>
      </div>
      <CardModalInteraction {...props} />
    </div>
  );
}

function ApproachInteraction(props) {
  return (
    <div className="approach-experience">
      <motion.div className="spectrum-card" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} whileHover={{ y: -3 }}><ShieldCheck className="spectrum-icon" size={28} /><strong>Predictive</strong><span>Stable requirements · baselines · WBS · critical path</span><small>~40%</small></motion.div>
        <motion.div variants={fadeUp} whileHover={{ y: -3 }}><SlidersHorizontal className="spectrum-icon" size={28} /><strong>Hybrid</strong><span>Predictive envelope with adaptive delivery inside it</span><small>seam work</small></motion.div>
        <motion.div variants={fadeUp} whileHover={{ y: -3 }}><Workflow className="spectrum-icon" size={28} /><strong>Adaptive / Agile</strong><span>Backlog · iterations · velocity · retrospectives</span><small>~60% with hybrid</small></motion.div>
      </motion.div>
      <CardModalInteraction {...props} />
    </div>
  );
}

function SelfAssessment({ onComplete, soundOn }) {
  const rows = [
    ["People (33%)", "Lead teams, manage conflict, engage and align stakeholders", "High — large share"],
    ["Process (41%)", "Plan and manage scope, schedule, cost, risk, quality, procurement", "Highest — largest share"],
    ["Business Environment (26%)", "Governance, compliance, change, continuous improvement", "High — tripled in 2026"],
    ["Agile / Hybrid fluency", "Choose and tailor approach; backlogs, iterations, seams", "High — about 60% of items"],
    ["ITTO & process logic", "Read any reference box as consume -> transform -> produce", "Medium — enables the rest"],
    ["Scenario judgement", "Pick the BEST next action under realistic pressure", "Highest — the exam's core"],
  ];
  const [scores, setScores] = useState({});
  const done = Object.keys(scores).length;
  useEffect(() => { if (done >= rows.length) onComplete(); }, [done, rows.length, onComplete]);
  const setScore = (area, score) => {
    playTone("tap", soundOn);
    setScores((items) => ({ ...items, [area]: score }));
  };
  const weakest = rows
    .filter(([area]) => scores[area])
    .sort(([a], [b]) => scores[a] - scores[b])
    .slice(0, 2)
    .map(([area]) => area);
  return (
    <div className="assessment-experience">
      <section className="priya-panel compact">
        <img src={stockImages.priya} alt="" />
        <div>
          <p className="mini-label">Priya · Making Sense of It</p>
          <p>Priya's first radar was lopsided: strong on People (her day job), weak on Business Environment and ITTO logic, shaky on agile.</p>
          <p>Old instinct: keep drilling People because it felt good. New plan: she pointed her next three weeks at Business Environment and approach selection — her widest, heaviest gaps. Her mock scores climbed precisely because she stopped studying what she already knew.</p>
        </div>
      </section>
      <div className="activity-instruction"><Target size={18} /><span>Score each area honestly from 1 to 4.</span></div>
      <div className="assessment-grid">
        {rows.map(([area, ready, priority]) => (
          <div className={scores[area] ? "assessment-row scored" : "assessment-row"} key={area}>
            <div><strong>{area}</strong><p>{ready}</p><small>{priority}</small></div>
            <div className="score-buttons" aria-label={`Score ${area}`}>
              {[1, 2, 3, 4].map((score) => (
                <button className={scores[area] === score ? "active" : ""} type="button" key={score} onClick={() => setScore(area, score)}>
                  {score}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="exam-lens compact">
        <Lightbulb size={18} />
        <span>{weakest.length ? `Next study block: ${weakest.join(" + ")}.` : "Find your widest gaps, then weight them by exam share."}</span>
      </div>
      <div className="reading-note">
        <h3>How to Use Your Scores</h3>
        <p>Find your widest gaps — the areas where your score is furthest from 4.</p>
        <p>Weight by exam share. A gap in Process (41%) costs more marks than the same gap in a lighter area.</p>
        <p>Let the widest, heaviest gaps claim your next study block. Not your comfortable strengths.</p>
      </div>
      <InteractionStatus done={done} total={rows.length} />
    </div>
  );
}

function CrosswalkReview({ onComplete }) {
  useEffect(() => { onComplete(); }, [onComplete]);
  const rows = [
    ["Initiating", "Module 2", "Business Environment · People", "Governance · Stakeholders"],
    ["Planning", "Module 3", "Process · People", "Scope · Schedule · Finance · Resources · Risk · Stakeholders · Governance"],
    ["Executing", "Module 4", "People · Process", "Resources · Stakeholders · Scope · Risk"],
    ["Monitoring & Controlling", "Module 5", "Process · Business Environment", "Schedule · Finance · Scope · Risk · Governance"],
    ["Closing", "Module 6", "Process · Business Environment", "Governance · Finance · Scope"],
    ["Agile & Hybrid", "Module 7", "All three domains", "All seven — tailored by approach"],
  ];
  return (
    <div className="assessment-experience">
      <div className="crosswalk-panel">
        <h3>Full Course Crosswalk</h3>
        <p>Every row is one Focus Area — one WHEN. Read across to see which ECO domains it draws on and which performance domains and processes carry the work. Return to this table whenever a later lesson feels disorienting.</p>
        <div className="crosswalk-table-wrap">
          <table className="crosswalk-table">
            <thead>
              <tr>
                <th>Focus Area (WHEN)</th>
                <th>Course Module</th>
                <th>ECO Domains (WHAT)</th>
                <th>Performance Domains / Processes (WHERE + HOW)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([area, module, eco, domains]) => (
                <tr key={area}>
                  <th scope="row">{area}</th>
                  <td>{module}</td>
                  <td>{eco}</td>
                  <td>{domains}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="figure-caption">Figure 0.5.d — The course spine: ECO domains (the WHAT) crossed with the five PMBOK® 8 Focus Areas (the WHEN). Every lesson sits at one intersection, so the whole course tiles the exam blueprint.</p>
      </div>
    </div>
  );
}

function ExamFrameworkReview({ onComplete }) {
  useEffect(() => { onComplete(); }, [onComplete]);
  const examLens = [
    [Network, "Recognize which domain a scenario belongs to — that classification often points to the answer."],
    [Lightbulb, "Treat enablers as judgement cues, not facts to recite."],
    [Search, "Read signal words (FIRST, BEST, MOST) as a demand to rank defensible options."],
    [MapPinned, "Locate the Focus Area to rule out actions inappropriate to the lifecycle phase."],
    [SlidersHorizontal, "Remember the ≈60% adaptive/hybrid tilt — when unsure, the iterative, value-protecting, people-first move is usually the principled one."],
  ];
  const framework = [
    [PanelsTopLeft, "FOCUS AREAS (when)", "PMBOK® 8's five reimagined Process Groups: Initiating → Planning → Executing → Monitoring & Controlling → Closing. The course modules."],
    [ClipboardList, "ECO (what is tested)", "Three weighted domains (People 33% · Process 41% · Business Environment 26%) → 26 tasks → illustrative enablers. The exam is written to the ECO."],
    [Network, "PERFORMANCE DOMAINS (where)", "Seven areas of practice: Governance, Scope, Schedule, Finance, Stakeholders, Resources, Risk. Governance replaced Integration; Finance replaced Cost; Quality/Communications/Procurement folded in."],
    [Workflow, "PROCESSES (how)", "40 non-prescriptive processes inside the domains, each an ITTO. Read for logic, not recall."],
    [SlidersHorizontal, "APPROACHES", "Predictive ↔ hybrid ↔ adaptive/agile on one certainty spectrum, run through every domain (≈40% / ≈60%)."],
  ];
  return (
    <motion.div className="assessment-experience" variants={stagger} initial="hidden" animate="show">
      <motion.section className="exam-framework-hero" variants={fadeUp}>
        <div>
          <p className="mini-label">Exam Lens</p>
          <h3>Use this page as a scenario filter, not a reading page.</h3>
          <p>This orientation lesson rarely produces direct 'what is the weight of Process?' items — but its ideas underpin every scenario you will face.</p>
        </div>
        <div className="exam-framework-icon"><Lightbulb size={40} /></div>
      </motion.section>
      <motion.section className="exam-lens-grid" variants={stagger}>
        {examLens.map(([Icon, text]) => (
          <motion.article key={text} variants={fadeUp} whileHover={{ y: -3 }}>
            <span><Icon size={24} /></span>
            <p>{text}</p>
          </motion.article>
        ))}
      </motion.section>
      <motion.section className="framework-crosswalk-panel" variants={fadeUp}>
        <div className="framework-crosswalk-head">
          <p className="mini-label">Framework Crosswalk</p>
          <h3>Four Lenses, One Project</h3>
        </div>
        <motion.div className="framework-grid" variants={stagger}>
          {framework.map(([Icon, title, body]) => (
            <motion.article key={title} variants={swipeIn} whileHover={{ y: -3 }}>
              <span><Icon size={24} /></span>
              <strong>{title}</strong>
              <p>{body}</p>
            </motion.article>
          ))}
        </motion.div>
        <div className="framework-join"><Lightbulb size={18} /><span>The join to remember: the ECO names the competency outcome; PMBOK® 8 supplies the process and the domain; the Focus Area supplies the timing.</span></div>
      </motion.section>
    </motion.div>
  );
}

function SectionActivity({ section, onComplete, soundOn }) {
  if (section.title === "Lesson Overview") return <IntroInteraction section={section} onComplete={onComplete} />;
  if (section.type === "lens-figure") return <LensFigure section={section} onComplete={onComplete} />;
  if (section.type === "lenses") return <LensSelector section={section} onComplete={onComplete} soundOn={soundOn} />;
  if (section.type === "focus") return <FocusAreaInteraction section={section} onComplete={onComplete} soundOn={soundOn} />;
  if (section.type === "eco") return <EcoInteraction section={section} onComplete={onComplete} soundOn={soundOn} />;
  if (section.type === "itto") return <IttoInteraction section={section} onComplete={onComplete} soundOn={soundOn} />;
  if (section.type === "approach") return <ApproachInteraction section={section} onComplete={onComplete} soundOn={soundOn} />;
  if (section.type === "assessment") return <SelfAssessment onComplete={onComplete} soundOn={soundOn} />;
  if (section.type === "crosswalk") return <CrosswalkReview onComplete={onComplete} />;
  if (section.type === "exam-framework") return <ExamFrameworkReview onComplete={onComplete} />;
  return <CardModalInteraction section={section} onComplete={onComplete} soundOn={soundOn} />;
}

function LessonSection({ section, onComplete, isComplete, soundOn }) {
  const isIntro = section.title === "Lesson Overview";
  return (
    <motion.section className="lesson-content" key={section.title} initial={{ opacity: 0, x: 70, filter: "blur(8px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -48, filter: "blur(6px)" }} transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}>
      <div className="lesson-hero">
        <motion.div className="hero-copy" variants={stagger} initial="hidden" animate="show">
          {isIntro && <p className="lesson-pill">Lesson 1.6</p>}
          {!isIntro && <motion.p className="eyebrow" variants={fadeUp}>{section.eyebrow}</motion.p>}
          <motion.h1 variants={fadeUp}>{section.title}</motion.h1>
          <motion.p variants={fadeUp}>{section.subtitle}</motion.p>
        </motion.div>
      </div>
      <motion.div className="slide-object-stage" variants={slideObject} initial="hidden" animate="show">
        <SectionActivity section={section} onComplete={onComplete} soundOn={soundOn} />
      </motion.div>
      <AnimatePresence>
        {isComplete && (
          <motion.div className="anchor" variants={successUnlock} initial="hidden" animate="show" exit={{ opacity: 0, y: 12 }}>
            <Check size={20} />
            <span>{section.anchor}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [completed, setCompleted] = useState(() => Array(sections.length).fill(false));
  const current = sections[activeIndex];
  const canContinue = completed[activeIndex];

  const markComplete = useCallback((index) => {
    setCompleted((items) => {
      if (items[index]) return items;
      if (index !== 0) playTone("success", soundOn);
      return items.map((item, itemIndex) => (itemIndex === index ? true : item));
    });
  }, [soundOn]);

  const goNext = () => setActiveIndex((index) => Math.min(index + 1, sections.length - 1));
  const goPrev = () => setActiveIndex((index) => Math.max(index - 1, 0));
  const progress = Math.round(((activeIndex + 1) / sections.length) * 100);

  return (
    <div className="app-shell">
      <TopBar soundOn={soundOn} onToggleSound={() => setSoundOn((value) => !value)} />
      <section className="workspace">
        <div className="lesson-stage">
          <div className="outline">
            <button className="menu-button" type="button" onClick={() => setOutlineOpen((open) => !open)} aria-label="Toggle lesson outline"><Menu size={20} /></button>
            {outlineOpen && (
              <div className="outline-panel">
                <div className="outline-summary"><div><strong>Lesson 1.6</strong><span>{progress}%</span></div><span className="summary-track"><span style={{ width: `${progress}%` }} /></span></div>
                <section className="study-block">
                  <div className="study-heading"><span><BookOpen size={18} /> Study Plan</span><span className="block-status">{activeIndex + 1}</span></div>
                  <div className="lesson-list">
                    {lessonList.map((title, index) => (
                      <button className={index === activeIndex ? "lesson current" : "lesson"} type="button" key={title} onClick={() => { if (completed[index] || index <= activeIndex) setActiveIndex(index); }}>
                        <ProgressDot state={completed[index] ? "done" : index === activeIndex ? "active" : "idle"} />
                        <span>{title}</span>
                        <small>{index + 1}</small>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
          <article className="lesson-card">
            <SectionTabs
              groups={sectionGroups}
              totalSections={sections.length}
              activeIndex={activeIndex}
              completed={completed}
              isReachable={(index) => completed[index] || index <= activeIndex}
              onSelect={setActiveIndex}
            />
            <AnimatePresence mode="wait">
              <LessonSection section={current} isComplete={completed[activeIndex]} onComplete={() => markComplete(activeIndex)} soundOn={soundOn} />
            </AnimatePresence>
            <footer className="nav-footer">
              <button className="secondary-button" type="button" onClick={goPrev} disabled={activeIndex === 0}><ArrowLeft size={18} /> Previous</button>
              <motion.button className={canContinue ? "primary-button unlocked" : "primary-button"} type="button" onClick={goNext} disabled={!canContinue} animate={canContinue ? { scale: [1, 1.035, 1] } : { scale: 1 }} transition={{ duration: 0.42, ease: "easeOut" }}>
                {!canContinue ? "Complete interactions" : activeIndex === sections.length - 1 ? "Complete" : "Continue"}
                <ArrowRight size={18} />
              </motion.button>
            </footer>
          </article>
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
