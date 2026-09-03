'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Music,
  ShoppingBag,
  Network,
  BarChart3,
  MessageSquare,
  Users,
  Calendar,
  Megaphone,
  User,
  Settings,
  Search,
  Bell,
  Play,
  Heart,
  Wallet,
  Check,
  Clock,
  AlertCircle,
  Upload,
  ChevronDown,
  Pencil,
  Share2,
  Music2,
  Headphones,
  Coins,
  Sparkles,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAnimatedCounter } from './useAnimatedCounter';
import { toast } from 'sonner';

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', icon: Home, href: '/dashboard', active: true },
  { label: 'My Tracks', icon: Music, href: '/tracks' },
  { label: 'Beat Store', icon: ShoppingBag, href: '/beats' },
  { label: 'Distribution', icon: Network, href: '/distribution' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Messages', icon: MessageSquare, href: '/messages', badge: 5 },
  { label: 'Fan Clubs', icon: Users, href: '/fan-clubs' },
  { label: 'Bookings', icon: Calendar, href: '/bookings' },
  { label: 'Campaigns', icon: Megaphone, href: '/campaigns' },
  { label: 'Profile', icon: User, href: '/profile' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

const STATS = [
  { label: 'Total Tracks', value: 12, sub: '3 uploaded this month', icon: Music2, color: '#8B5CF6' },
  { label: 'Total Plays', value: 45200, sub: '↑ 23%', icon: Play, color: '#EC4899', isCompact: true },
  { label: 'Revenue', value: 234500, sub: '↑ 15%', icon: Wallet, color: '#10B981', isCurrency: true },
  { label: 'Active Fans', value: 1234, sub: '↑ 8%', icon: Heart, color: '#F59E0B', isCompact: true },
];

const RECENT_TRACKS = [
  { title: 'Last Last', plays: 12300, revenue: 45000, cover: 'from-purple-600 via-pink-500 to-orange-400' },
  { title: 'Kilometre', plays: 9800, revenue: 38000, cover: 'from-blue-600 via-cyan-500 to-teal-400' },
  { title: "It's Plenty", plays: 8200, revenue: 32000, cover: 'from-rose-600 via-red-500 to-yellow-400' },
];

const PLATFORMS = [
  { name: 'Spotify', status: 'live', tracks: '12 tracks', plays: '23.4K plays', color: '#1DB954' },
  { name: 'Apple Music', status: 'live', tracks: '12 tracks', plays: '18.2K plays', color: '#FA243C' },
  { name: 'Audiomack', status: 'live', tracks: '12 tracks', plays: '31.5K plays', color: '#FFA200' },
  { name: 'YouTube Music', status: 'processing', tracks: '11 tracks', plays: '15.8K views', color: '#FF0000' },
  { name: 'Instagram', status: 'live', tracks: '15 posts', plays: '89.2K reach', color: '#E1306C' },
  { name: 'TikTok', status: 'live', tracks: '23 videos', plays: '234K views', color: '#000000' },
  { name: 'Twitter/X', status: 'pending', tracks: '10 posts', plays: 'Setup required', color: '#1DA1F2' },
];

const QUICK_ACTIONS = [
  { label: 'Upload New Track', icon: Upload, gradient: 'from-[#8B5CF6] to-[#EC4899]' },
  { label: 'Create Campaign', icon: Megaphone, gradient: 'from-blue-500 to-cyan-400' },
  { label: 'View Analytics', icon: BarChart3, gradient: 'from-emerald-500 to-green-400' },
  { label: 'Message Fans', icon: MessageSquare, gradient: 'from-orange-500 to-amber-400' },
];

const ACTIVITIES = [
  { icon: Music, text: "'Last Last' reached 1,000 plays", time: '2 hours ago', color: '#8B5CF6' },
  { icon: Coins, text: 'New fan subscription: Gold Tier (₦5,000)', time: '3 hours ago', color: '#F59E0B' },
  { icon: Headphones, text: "Beat 'Afro Vibes' purchased - Basic License", time: '5 hours ago', color: '#10B981' },
  { icon: BarChart3, text: "'Kilometre' now live on Spotify", time: '1 day ago', color: '#1DB954' },
  { icon: Users, text: '5 new followers on Instagram', time: '1 day ago', color: '#E1306C' },
  { icon: MessageSquare, text: 'New message from @producer_jay', time: '2 days ago', color: '#1DA1F2' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'K';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}

/* ------------------------------------------------------------------ */
/*  Animated Stat Card                                                */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  isCurrency,
  isCompact,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  isCurrency?: boolean;
  isCompact?: boolean;
}) {
  const { value: animated, ref } = useAnimatedCounter(value);

  const display = isCurrency
    ? formatNaira(Math.floor(animated))
    : isCompact
    ? formatCompact(Math.floor(animated))
    : Math.floor(animated).toLocaleString();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative rounded-xl border border-[#222222] bg-[#111111]/80 backdrop-blur-md p-5 overflow-hidden group cursor-default"
    >
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: color }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[#9CA3AF] font-medium">{label}</span>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: `${color}1A` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        </div>
        <span ref={ref} className="block text-3xl font-bold text-white tabular-nums">
          {display}
        </span>
        <span className="text-xs text-[#9CA3AF] mt-1 block">{sub}</span>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Platform Badge                                                    */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    live: { bg: 'bg-[#10B981]/15', text: 'text-[#10B981]', label: 'Live' },
    processing: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]', label: 'Processing' },
    pending: { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]', label: 'Pending' },
  };
  const c = config[status] ?? config.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {status === 'live' && <Check className="w-3 h-3" />}
      {status === 'processing' && <Clock className="w-3 h-3" />}
      {status === 'pending' && <AlertCircle className="w-3 h-3" />}
      {c.label}
    </span>
  );
}

function PlatformInitial({ name, color }: { name: string; color: string }) {
  const letter = name.charAt(0);
  return (
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
      style={{ background: color }}
    >
      {letter}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent Track Card                                                 */
/* ------------------------------------------------------------------ */

function RecentTrackCard({
  title,
  plays,
  revenue,
  cover,
}: {
  title: string;
  plays: number;
  revenue: number;
  cover: string;
}) {
  const platformIcons = [
    { letter: 'S', color: '#1DB954' },
    { letter: 'A', color: '#FA243C' },
    { letter: 'Au', color: '#FFA200' },
    { letter: 'Y', color: '#FF0000' },
    { letter: 'Ig', color: '#E1306C' },
    { letter: 'Tt', color: '#000000' },
    { letter: 'X', color: '#1DA1F2' },
  ];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="rounded-xl border border-[#222222] bg-[#111111]/80 backdrop-blur-md overflow-hidden group"
    >
      <div className={`relative h-32 bg-gradient-to-br ${cover}`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
        <div className="flex items-center gap-1.5 text-[#9CA3AF] text-xs mb-3">
          <Play className="w-3 h-3" />
          {formatCompact(plays)} plays
        </div>
        <div className="flex items-center gap-1 mb-3">
          {platformIcons.map((p) => (
            <div key={p.letter} className="relative">
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold text-white"
                style={{ background: p.color }}
              >
                {p.letter}
              </div>
              <Check className="absolute -top-1 -right-1 w-2.5 h-2.5 text-[#10B981] bg-[#111111] rounded-full p-0.5" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#10B981] font-semibold text-sm">{formatNaira(revenue)}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => toast.success(`Opening editor for "${title}"`)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>
            <button
              onClick={() => toast.success(`Opening analytics for "${title}"`)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Analytics"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>
            <button
              onClick={() => toast.success(`Share link for "${title}" copied!`)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick Action Button                                               */
/* ------------------------------------------------------------------ */

function QuickActionButton({
  label,
  icon: Icon,
  gradient,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => toast.success(label)}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${gradient} p-5 flex flex-col items-center gap-3 text-white font-semibold shadow-lg`}
    >
      <Icon className="w-7 h-7" />
      <span className="text-sm text-center leading-tight">{label}</span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Activity Feed Item                                                */
/* ------------------------------------------------------------------ */

function ActivityItem({
  icon: Icon,
  text,
  time,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  text: string;
  time: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#222222] last:border-0">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `${color}1A` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white leading-snug">{text}</p>
        <p className="text-xs text-[#9CA3AF] mt-0.5">{time}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Bottom Nav                                                 */
/* ------------------------------------------------------------------ */

const MOBILE_NAV = [
  { label: 'Home', icon: Home, href: '/dashboard' },
  { label: 'Tracks', icon: Music, href: '/tracks' },
  { label: 'Upload', icon: Upload, href: '/tracks/upload', isCenter: true },
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Messages', icon: MessageSquare, href: '/messages' },
];

function MobileBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#222222]">
      <div className="flex items-center justify-around h-16 px-2">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          if (item.isCenter) {
            return (
              <Link key={item.label} href={item.href}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] flex items-center justify-center -mt-6 shadow-lg shadow-[#8B5CF6]/30">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </Link>
            );
          }
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 text-[#9CA3AF] hover:text-white transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */

export function ArtistDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* ===== Top Navigation ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#222222] h-16">
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-2 text-[#9CA3AF] hover:text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Music className="w-5 h-5" />
            </button>
            <span className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
              BeatsPush
            </span>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 items-center gap-2 bg-[#111111] border border-[#222222] rounded-lg px-3 py-2 focus-within:border-[#8B5CF6]/50 transition-colors">
            <Search className="w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search tracks, artists, beats..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#9CA3AF] outline-none"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-[#9CA3AF] hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Avatar className="w-8 h-8 border border-[#222222]">
                  <AvatarFallback className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-bold">
                    BB
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-[#9CA3AF] hidden md:block" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-[#111111] border border-[#222222] rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-[#222222]">
                      <p className="text-sm font-semibold text-white">Burna Boy</p>
                      <p className="text-xs text-[#9CA3AF]">burna@beatspush.com</p>
                    </div>
                    <div className="py-2">
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors" onClick={() => setProfileOpen(false)}>
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-colors" onClick={() => setProfileOpen(false)}>
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Upload Track Button */}
            <Link href="/tracks/upload">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-sm font-semibold shadow-lg shadow-[#8B5CF6]/30 hover:shadow-[#8B5CF6]/50 hover:scale-105 transition-all">
                <Upload className="w-4 h-4" />
                Upload Track
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ===== Sidebar (Desktop) ===== */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-60 bg-[#111111] border-r border-[#222222] z-40">
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  item.active
                    ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#EC4899]/20 text-white border-l-2 border-[#8B5CF6]'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-[#EC4899] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ===== Sidebar (Mobile Drawer) ===== */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-[#111111] border-r border-[#222222] z-50 pt-16 overflow-y-auto"
            >
              <nav className="py-4 px-3 space-y-1">
                {SIDEBAR_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        item.active
                          ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#EC4899]/20 text-white border-l-2 border-[#8B5CF6]'
                          : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="bg-[#EC4899] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== Main Content ===== */}
      <div className="pt-16 lg:pl-60 pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">
          {/* A. Welcome Banner */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899] p-6 md:p-8"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-[#EC4899]/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-white/90" />
                <span className="text-white/80 text-sm font-medium">Lagos, Nigeria · Afrobeats, Afro-fusion, Dancehall</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome back, Burna Boy! 🎵
              </h1>
              <p className="text-white/80 text-base">
                Your music reached 45.2K people this week
              </p>
            </div>
          </motion.section>

          {/* B. Quick Stats */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {STATS.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </motion.section>

          {/* C. Recent Uploads */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Recent Uploads</h2>
              <Link href="/tracks" className="text-sm text-[#8B5CF6] hover:text-[#EC4899] transition-colors font-medium">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {RECENT_TRACKS.map((track) => (
                <RecentTrackCard key={track.title} {...track} />
              ))}
            </div>
          </motion.section>

          {/* D. Distribution Status */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl border border-[#222222] bg-[#111111]/80 backdrop-blur-md p-5 md:p-6"
          >
            <h2 className="text-xl font-bold text-white mb-5">Distribution Status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {PLATFORMS.map((p) => (
                <motion.div
                  key={p.name}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="rounded-lg border border-[#222222] bg-[#0A0A0A]/60 p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <PlatformInitial name={p.name} color={p.color} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                  <div className="text-xs text-[#9CA3AF]">
                    <p>{p.tracks}</p>
                    <p className="mt-0.5">{p.plays}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* E. Quick Actions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {QUICK_ACTIONS.map((action) => (
                <QuickActionButton key={action.label} {...action} />
              ))}
            </div>
          </motion.section>

          {/* F. Recent Activity */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-xl border border-[#222222] bg-[#111111]/80 backdrop-blur-md p-5 md:p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div>
              {ACTIVITIES.map((act, i) => (
                <ActivityItem key={i} {...act} />
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      {/* ===== Mobile Bottom Nav ===== */}
      <MobileBottomNav />
    </div>
  );
}
