import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowTrendingUpIcon,
  BoltIcon,
  ChartBarSquareIcon,
  ChatBubbleLeftRightIcon,
  CursorArrowRaysIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Landing = () => (
  <div className="space-y-12">
    <section className="grid gap-10 overflow-hidden rounded-[2rem] bg-hero-gradient p-8 text-white shadow-glow lg:grid-cols-[1.15fr_0.85fr] lg:p-12">
      <div className="space-y-7">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
          <SparklesIcon className="h-4 w-4" /> AI-powered emergency rescue coordination
        </p>
        <div className="space-y-4">
          <h1 className="max-w-3xl font-display text-4xl leading-tight md:text-6xl">
            Report animal emergencies in seconds and dispatch real-time rescue support.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-blue-50/90">
            RescueAI helps citizens, volunteers, NGOs, and vets respond faster with smart urgency scoring, live location tracking, and AI rescue guidance built for real field operations.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/report" className="btn-emergency px-6 py-4 text-base">
            <BoltIcon className="h-5 w-5" /> Report Emergency
          </Link>
          <Link to="/signup" className="btn-secondary border-white/20 bg-white/10 px-6 py-4 text-base text-white hover:bg-white/15">
            Join as Volunteer
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { value: "< 90s", label: "Alert broadcast time" },
            { value: "24/7", label: "Volunteer network ready" },
            { value: "AI", label: "Severity and animal detection" },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
              <p className="text-3xl font-semibold">{item.value}</p>
              <p className="mt-2 text-sm text-blue-100">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-overlay relative rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
        <div className="absolute right-6 top-6 rounded-full bg-orange-400/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-orange-100">
          Command View
        </div>
        <div className="space-y-4 pt-10">
          <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Live SOS cluster</p>
                <p className="mt-2 text-2xl font-semibold">6 active rescue cases</p>
              </div>
              <span className="rounded-full bg-orange-400 px-3 py-1 text-xs font-bold text-white">
                High priority
              </span>
            </div>
          </div>
          {[
            { title: "Injured street dog", status: "Volunteer assigned", eta: "ETA 08 min" },
            { title: "Bird wing trauma", status: "NGO notified", eta: "ETA 14 min" },
            { title: "Cow roadside collapse", status: "Vet escalation", eta: "ETA 05 min" },
          ].map((card) => (
            <div key={card.title} className="rounded-3xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{card.title}</p>
                  <p className="mt-1 text-sm text-blue-100">{card.status}</p>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-orange-200">
                  {card.eta}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {[
        { title: "One-tap reporting", desc: "Upload an image, capture GPS, and submit a rescue case in seconds.", icon: SparklesIcon },
        { title: "Volunteer dispatch", desc: "Nearby responders receive instant alerts and can accept missions immediately.", icon: CursorArrowRaysIcon },
        { title: "AI rescue suggestions", desc: "Animal type detection and beginner-safe first-aid guidance help while help is on the way.", icon: ChatBubbleLeftRightIcon },
        { title: "NGO analytics", desc: "Track heatmaps, status trends, and operational response quality across the city.", icon: ChartBarSquareIcon },
      ].map((item) => (
        <div key={item.title} className="panel animate-slideUp rounded-[2rem]">
          <item.icon className="mb-4 h-10 w-10 text-primary" />
          <h3 className="text-xl font-semibold">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.desc}</p>
        </div>
      ))}
    </section>

    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="panel rounded-[2rem]">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <CursorArrowRaysIcon className="h-5 w-5" /> Rapid response matters
        </p>
        <h2 className="mt-3 text-3xl">Built for modern rescue operations</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          The product architecture is designed around real-time rescue dispatch, easy volunteer onboarding, and AI-assisted triage. That means the UI your mentor sees already reflects the backend flow you want to scale later.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "Trust", value: "Secure JWT auth and role access", icon: ShieldCheckIcon },
            { label: "Speed", value: "Socket-based live coordination", icon: ArrowTrendingUpIcon },
            { label: "Action", value: "Field-ready dashboard and SOS flow", icon: BoltIcon },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/80">
              <item.icon className="h-8 w-8 text-primary" />
              <p className="mt-4 text-lg font-semibold">{item.label}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-dark">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">RescueAI flow</p>
        <div className="mt-6 space-y-4">
          {[
            "Citizen submits SOS report with image and GPS.",
            "AI analyzes severity, animal type, and duplicate risk.",
            "Nearby volunteers and NGOs receive real-time dispatch alerts.",
            "Live tracking, chat, and dashboard updates keep everyone aligned.",
          ].map((step, index) => (
            <div key={step} className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-orange-400 text-sm font-bold text-white">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-slate-200">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <Link to="/signup" className="btn-primary px-6 py-3">Become Volunteer</Link>
          <Link to="/report" className="btn-secondary border-white/10 bg-white/10 px-6 py-3 text-white hover:bg-white/15">Report Now</Link>
        </div>
      </div>
    </section>
  </div>
);

export default Landing;
