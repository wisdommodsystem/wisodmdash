"use client";

import { useState } from "react";
import { LogoutButton } from "@/components/hwaya/LogoutButton";
import { RoleManagement } from "@/components/hwaya/RoleManagement";
import { TicketManagement } from "@/components/hwaya/TicketManagement";
import { LayoutDashboard, Settings2, LifeBuoy, UserPlus, Shield, Menu, X, Calendar } from "lucide-react";
import { StaffManagement } from "@/components/StaffManagement";
import { PermissionManagement } from "@/components/hwaya/PermissionManagement";
import { EventManagement } from "@/components/hwaya/EventManagement";
import { GiveawayManagement } from "@/components/hwaya/GiveawayManagement";
import { NotificationManagement } from "@/components/hwaya/NotificationManagement";
import { Gift, Bell } from "lucide-react";

interface HwayaDashboardClientProps {
  insights: {
    totalMembers: string;
    onlineNow: string;
    topChampion: string;
    engagementScore: string;
  };
}

type TabId = "insights" | "roles" | "tickets" | "staff" | "permissions" | "events" | "giveaways" | "notifications";

export function HwayaDashboardClient({ insights }: HwayaDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("insights");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row gap-6">
      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0f111a] px-4 md:hidden fixed top-0 left-0 right-0 z-[100] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative group/logo">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#5865F2] via-[#D4AF37] to-[#5865F2] rounded-lg blur-[2px] opacity-20" />
            <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#0a0e1a]">
              <img 
                src="https://i.postimg.cc/7YXBBpPW/wisdomlogo.png" 
                alt="Wisdom Logo" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[11px] font-black text-white uppercase tracking-tighter leading-none italic">Wisdom</h2>
            <span className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-widest mt-0.5 opacity-80">Admin Panel</span>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all active:scale-95"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#121623] border-r border-white/10 p-4 transition-transform duration-300 z-[120] md:relative md:translate-x-0 md:flex md:w-[280px] md:h-fit md:rounded-2xl md:border ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col w-full h-full">
          <div className="px-6 py-8 mb-4 hidden md:block border-b border-white/[0.03]">
            <div className="flex items-center gap-4 group/brand cursor-default">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#5865F2] to-[#D4AF37] rounded-xl blur-md opacity-10 group-hover/brand:opacity-25 transition-all duration-700" />
                <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/10 bg-[#0a0e1a] shadow-lg transition-transform duration-500 group-hover/brand:scale-105">
                  <img 
                    src="https://i.postimg.cc/7YXBBpPW/wisdomlogo.png" 
                    alt="Wisdom Logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-black text-white tracking-tighter leading-none uppercase italic">Wisdom</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] text-[#D4AF37] font-black tracking-widest uppercase opacity-80">Strategic</span>
                  <span className="text-[9px] text-slate-500 font-bold tracking-tighter uppercase opacity-60">Admin</span>
                </div>
              </div>
            </div>
          </div>
          <nav className="space-y-2 flex-1">
            <button
              onClick={() => { setActiveTab("insights"); setIsMobileMenuOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === "insights"
                  ? "bg-[#5865F2] text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Website Insights
            </button>
            <button
              onClick={() => { setActiveTab("events"); setIsMobileMenuOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === "events"
                  ? "bg-[#5865F2] text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Event Calendar
            </button>
            <button
              onClick={() => { setActiveTab("giveaways"); setIsMobileMenuOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === "giveaways"
                  ? "bg-[#5865F2] text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Gift className="h-4 w-4" />
              Giveaways
            </button>
            <button
              onClick={() => { setActiveTab("notifications"); setIsMobileMenuOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === "notifications"
                  ? "bg-[#5865F2] text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Bell className="h-4 w-4" />
              Broadcasts
            </button>
            <button
              onClick={() => { setActiveTab("roles"); setIsMobileMenuOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === "roles"
                  ? "bg-[#5865F2] text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings2 className="h-4 w-4" />
              Profile Roles
            </button>
            <button
              onClick={() => { setActiveTab("tickets"); setIsMobileMenuOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === "tickets"
                  ? "bg-[#5865F2] text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LifeBuoy className="h-4 w-4" />
              Support Tickets
            </button>
            <button
              onClick={() => { setActiveTab("staff"); setIsMobileMenuOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === "staff"
                  ? "bg-[#5865F2] text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Staff Applications
            </button>
            <button
              onClick={() => { setActiveTab("permissions"); setIsMobileMenuOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === "permissions"
                  ? "bg-[#5865F2] text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Shield className="h-4 w-4" />
              Permission Requests
            </button>

            <div className="mt-8 border-t border-white/5 pt-6 space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3">
                System Health
              </p>
              <div className="px-3 space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Server Status</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">API Latency</span>
                  <span className="text-white font-mono">24ms</span>
                </div>
              </div>
            </div>
          </nav>
          <div className="mt-auto pt-6 border-t border-white/5">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <section className="flex-1 rounded-2xl border border-white/10 bg-[#101523] p-4 md:p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto">
          {activeTab === "insights" ? (
          <>
            <h1 className="text-xl md:text-2xl font-semibold text-white">Website Insights</h1>
            <p className="mt-1 text-sm text-slate-400">
              Secure analytics overview for Wisdom Circle.
            </p>

            <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
              <InsightCard title="Total Members" value={insights.totalMembers} />
              <InsightCard title="Online Now" value={insights.onlineNow} />
              <InsightCard title="Top Champion" value={insights.topChampion} />
              <InsightCard
                title="Engagement Score"
                value={insights.engagementScore}
              />
            </div>
          </>
        ) : activeTab === "events" ? (
          <>
            <h1 className="text-xl md:text-2xl font-semibold text-white">Event Calendar</h1>
            <p className="mt-1 text-sm text-slate-400 mb-6">
              Manage and schedule upcoming community events.
            </p>
            <EventManagement />
          </>
        ) : activeTab === "giveaways" ? (
          <>
            <h1 className="text-xl md:text-2xl font-semibold text-white">Giveaway Management</h1>
            <p className="mt-1 text-sm text-slate-400 mb-6">
              Create and manage community giveaways.
            </p>
            <GiveawayManagement />
          </>
        ) : activeTab === "notifications" ? (
          <>
            <h1 className="text-xl md:text-2xl font-semibold text-white">Notification Broadcast</h1>
            <p className="mt-1 text-sm text-slate-400 mb-6">
              Send global or specific notifications to scholars.
            </p>
            <NotificationManagement />
          </>
        ) : activeTab === "roles" ? (
          <>
            <h1 className="text-xl md:text-2xl font-semibold text-white">Role Management</h1>
            <p className="mt-1 text-sm text-slate-400 mb-6">
              Manage customizable roles for Discord profiles.
            </p>
            <RoleManagement />
          </>
        ) : activeTab === "tickets" ? (
          <>
            <h1 className="text-xl md:text-2xl font-semibold text-white">Support Management</h1>
            <p className="mt-1 text-sm text-slate-400 mb-6">
              Respond to user reports and suggestions.
            </p>
            <TicketManagement />
          </>
        ) : activeTab === "staff" ? (
          <>
            <h1 className="text-xl md:text-2xl font-semibold text-white">Staff Management</h1>
            <p className="mt-1 text-sm text-slate-400 mb-6">
              Review staff applications and toggle availability.
            </p>
            <StaffManagement />
          </>
        ) : (
          <>
            <h1 className="text-xl md:text-2xl font-semibold text-white">Permission Requests</h1>
            <p className="mt-1 text-sm text-slate-400 mb-6">
              Review and manage user permission requests.
            </p>
            <PermissionManagement />
          </>
        )}
        </div>
      </section>
    </div>
  );
}

function InsightCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#121623] p-4 md:p-6 transition-all hover:border-[#5865F2]/30 group">
      <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 group-hover:text-slate-400 transition-colors">
        {title}
      </p>
      <p className="text-xl md:text-2xl font-black text-white group-hover:scale-105 transition-transform origin-left duration-300">
        {value}
      </p>
    </div>
  );
}
