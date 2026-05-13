import React from "react";
import { Link } from "react-router-dom";
import { SparklesIcon, ShieldCheckIcon, CursorArrowRaysIcon } from "@heroicons/react/24/outline";

const Landing = () => (
  <div className="space-y-14">
    <section className="grid lg:grid-cols-2 gap-10 items-center rounded-3xl glass p-8 bg-hero-gradient">
      <div className="space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary-light text-primary-dark px-3 py-1 text-xs font-semibold">
          <SparklesIcon className="h-4 w-4" /> Saving Lives, One Rescue at a Time
        </p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight">
          Smart Animal Emergency Response built for speed and compassion.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-200">
          Report injured animals instantly, mobilize nearby volunteers, and keep every rescue on track with real-time updates.
        </p>
        <div className="flex gap-3">
          <Link to="/report" className="btn-primary px-6 py-3">Report Animal</Link>
          <Link to="/signup" className="btn-secondary px-6 py-3">Join as Volunteer</Link>
        </div>
      </div>
      <div className="relative">
        <div className="absolute -inset-6 bg-primary-light blur-3xl opacity-60" />
        <div className="relative glass rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Live Cases</span>
            <span>Auto-prioritized</span>
          </div>
          {["Bleeding street dog", "Cat stuck on tree", "Puppy hit by bike"].map((title, idx) => (
            <div key={title} className="rounded-2xl bg-white/80 dark:bg-slate-800/70 border border-white/40 dark:border-slate-700 p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{title}</p>
                <p className="text-xs text-slate-500">Priority {["High", "Medium", "High"][idx]}</p>
              </div>
              <span className="text-emerald-500 text-xs font-bold">+ nearby volunteers</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="grid md:grid-cols-3 gap-6">
      {[
        { title: "One-tap reporting", desc: "Upload a photo, share a quick note, and RescueAI detects urgency automatically." },
        { title: "Volunteer radar", desc: "See nearby cases, accept missions, and coordinate with live updates." },
        { title: "Admin oversight", desc: "Manage users, monitor status, and keep every rescue accountable." },
      ].map((item) => (
        <div key={item.title} className="glass rounded-2xl p-5">
          <ShieldCheckIcon className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-2">{item.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
        </div>
      ))}
    </section>

    <section className="glass rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <p className="text-sm font-semibold text-primary flex items-center gap-2">
          <CursorArrowRaysIcon className="h-5 w-5" /> Rapid response matters
        </p>
        <h2 className="font-display text-3xl mt-2">Ready to rescue smarter?</h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Join the RescueAI network and be first on scene when an animal needs you.
        </p>
      </div>
      <div className="flex gap-3">
        <Link to="/signup" className="btn-primary px-6 py-3">Become Volunteer</Link>
        <Link to="/report" className="btn-secondary px-6 py-3">Report Now</Link>
      </div>
    </section>
  </div>
);

export default Landing;
