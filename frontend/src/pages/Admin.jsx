import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  LogOut, Lock, Mail, Calendar, Tag, Users, TrendingUp, Search, Download, ArrowLeft,
  MessageSquare, DollarSign, Receipt,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const STORAGE_KEY = "sl_admin_token";

const BOOKING_STATUSES = [
  { id: "deposit_paid", label: "Deposit Paid" },
  { id: "trip_confirmed", label: "Trip Confirmed" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch { return iso; }
}

export default function Admin() {
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") return sessionStorage.getItem(STORAGE_KEY) || "";
    return "";
  });
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState("leads"); // "leads" | "bookings"
  const [leads, setLeads] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const authHeader = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const loadAll = async (bearer) => {
    setLoading(true);
    try {
      const [leadsRes, bookingsRes] = await Promise.all([
        axios.get(`${API}/admin/leads`, { headers: { Authorization: `Bearer ${bearer}` } }),
        axios.get(`${API}/admin/bookings`, { headers: { Authorization: `Bearer ${bearer}` } }),
      ]);
      setLeads(leadsRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session expired — please sign in again.");
        sessionStorage.removeItem(STORAGE_KEY);
        setToken("");
      } else {
        toast.error("Could not load data.", { description: err?.message });
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { if (token) loadAll(token); /* eslint-disable-next-line */ }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoggingIn(true);
    try {
      const res = await axios.post(`${API}/admin/login`, { password: password.trim() });
      sessionStorage.setItem(STORAGE_KEY, res.data.token);
      setToken(res.data.token);
      setPassword("");
      toast.success("Signed in.");
    } catch (err) {
      toast.error("Wrong password.", { description: err?.response?.data?.detail });
    } finally { setLoggingIn(false); }
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY); setToken(""); setLeads([]); setBookings([]);
  };

  const updateBookingStatus = async (booking_id, status) => {
    try {
      await axios.patch(`${API}/admin/bookings/${booking_id}`, { status }, authHeader());
      setBookings((prev) => prev.map((b) => (b.booking_id === booking_id ? { ...b, status } : b)));
      toast.success("Status updated.");
    } catch (err) {
      toast.error("Could not update.", { description: err?.response?.data?.detail || err?.message });
    }
  };

  const filteredLeads = useMemo(() => {
    if (!query.trim()) return leads;
    const q = query.trim().toLowerCase();
    return leads.filter((l) =>
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      (l.interests || []).some((i) => i.toLowerCase().includes(q)) ||
      (l.message || "").toLowerCase().includes(q)
    );
  }, [leads, query]);

  const filteredBookings = useMemo(() => {
    if (!query.trim()) return bookings;
    const q = query.trim().toLowerCase();
    return bookings.filter((b) =>
      b.guest_name?.toLowerCase().includes(q) ||
      b.guest_email?.toLowerCase().includes(q) ||
      b.package_name?.toLowerCase().includes(q) ||
      (b.guest_whatsapp || "").toLowerCase().includes(q)
    );
  }, [bookings, query]);

  const leadStats = useMemo(() => {
    const total = leads.length;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const last7 = leads.filter((l) => new Date(l.created_at).getTime() >= weekAgo).length;
    const avgDays = total ? Math.round(leads.reduce((a, l) => a + (Number(l.days) || 0), 0) / total) : 0;
    const tally = {};
    leads.forEach((l) => (l.interests || []).forEach((i) => (tally[i] = (tally[i] || 0) + 1)));
    const top = Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 1);
    return { total, last7, avgDays, top: top[0]?.[0] || "—" };
  }, [leads]);

  const bookingStats = useMemo(() => {
    const total = bookings.length;
    const depositPaid = bookings.reduce((a, b) => a + Number(b.deposit_amount || 0), 0);
    const balanceDue = bookings.reduce((a, b) => a + Number(b.balance_due || 0), 0);
    const revenue = bookings.reduce((a, b) => a + Number(b.total_price || 0), 0);
    return { total, depositPaid, balanceDue, revenue };
  }, [bookings]);

  const downloadCsv = () => {
    const rows = tab === "leads"
      ? [
        ["Name", "Email", "Days", "Interests", "Message", "Created At"],
        ...filteredLeads.map((l) => [l.name, l.email, l.days, (l.interests || []).join(" | "), (l.message || "").replace(/\n/g, " "), l.created_at]),
      ]
      : [
        ["Received", "Guest", "Email", "WhatsApp", "Package", "Arrival", "Departure", "Travellers", "Total", "Deposit", "Balance", "Status"],
        ...filteredBookings.map((b) => [b.created_at, b.guest_name, b.guest_email, b.guest_whatsapp, b.package_name, b.arrival_date, b.departure_date, b.num_travellers, b.total_price, b.deposit_amount, b.balance_due, b.status]),
      ];
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = `serendib-${tab}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // -------- Login screen --------
  if (!token) {
    return (
      <main className="min-h-screen bg-sand-50 flex items-center justify-center px-6" data-testid="admin-login">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-[#4B5563] hover:text-jungle-700 text-sm mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
          <div className="rounded-2xl border border-sand-200 bg-sand-50 p-8 md:p-10 shadow-[0_30px_80px_-50px_rgba(26,54,45,0.4)]">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-jungle-700 text-clay-500">
              <Lock className="h-5 w-5" />
            </span>
            <h1 className="mt-6 font-display text-4xl md:text-5xl leading-tight text-[#111827]">Admin.</h1>
            <p className="mt-2 text-[#4B5563] text-sm">Sign in to view leads &amp; bookings.</p>
            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <label className="block text-xs text-[#4B5563] mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus data-testid="admin-password" className="w-full rounded-lg bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none px-4 py-3" />
              </div>
              <button type="submit" disabled={loggingIn} data-testid="admin-login-submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-jungle-700 hover:bg-jungle-800 disabled:opacity-60 text-sand-50 px-6 py-3 text-sm font-medium transition-all">
                {loggingIn ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // -------- Dashboard --------
  return (
    <main className="min-h-screen bg-sand-50" data-testid="admin-dashboard">
      <header className="border-b border-sand-200 bg-sand-50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl text-[#111827]">
            Serendib Local<span className="text-clay-500">.</span>{" "}
            <span className="text-[#4B5563] text-sm font-sans">/ admin</span>
          </Link>
          <button onClick={logout} data-testid="admin-logout" className="inline-flex items-center gap-2 rounded-full border border-sand-200 hover:border-clay-500 text-[#111827] px-4 py-2 text-xs">
            <LogOut className="h-3.5 w-3.5" /> Log out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-sand-100 border border-sand-200" data-testid="admin-tabs">
          <button
            onClick={() => setTab("leads")}
            data-testid="admin-tab-leads"
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${tab === "leads" ? "bg-jungle-700 text-sand-50" : "text-[#111827] hover:text-jungle-700"}`}
          >
            Leads <span className="text-xs opacity-75 ml-1">({leads.length})</span>
          </button>
          <button
            onClick={() => setTab("bookings")}
            data-testid="admin-tab-bookings"
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${tab === "bookings" ? "bg-jungle-700 text-sand-50" : "text-[#111827] hover:text-jungle-700"}`}
          >
            Bookings <span className="text-xs opacity-75 ml-1">({bookings.length})</span>
          </button>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl leading-tight">
              {loading ? "Loading…" : tab === "leads" ? `${leadStats.total} leads total` : `${bookingStats.total} bookings · $${bookingStats.revenue.toLocaleString()} booked`}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" data-testid="admin-search" className="pl-10 pr-4 py-2.5 rounded-full bg-sand-50 border border-sand-200 focus:border-jungle-700 outline-none text-sm w-64" />
            </div>
            <button onClick={downloadCsv} data-testid="admin-download-csv" className="inline-flex items-center gap-2 rounded-full border border-sand-200 hover:border-jungle-700 px-4 py-2.5 text-xs font-medium">
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        {tab === "leads" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-testid="admin-stats-leads">
            <StatCard icon={Users} label="Total leads" value={leadStats.total} />
            <StatCard icon={TrendingUp} label="Last 7 days" value={leadStats.last7} />
            <StatCard icon={Calendar} label="Avg. trip length" value={`${leadStats.avgDays}d`} />
            <StatCard icon={Tag} label="Top interest" value={leadStats.top} small />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-testid="admin-stats-bookings">
            <StatCard icon={Receipt} label="Bookings" value={bookingStats.total} />
            <StatCard icon={DollarSign} label="Deposits received" value={`$${bookingStats.depositPaid.toLocaleString()}`} small />
            <StatCard icon={TrendingUp} label="Total revenue" value={`$${bookingStats.revenue.toLocaleString()}`} small />
            <StatCard icon={Calendar} label="Balance due" value={`$${bookingStats.balanceDue.toLocaleString()}`} small />
          </div>
        )}

        {/* Tables */}
        {tab === "leads" ? (
          <div className="rounded-2xl border border-sand-200 bg-sand-50 overflow-hidden" data-testid="admin-leads-table">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-sand-100 text-[#4B5563] text-xs uppercase tracking-widest">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium">Name</th>
                    <th className="text-left px-5 py-3 font-medium">Email</th>
                    <th className="text-left px-5 py-3 font-medium">Days</th>
                    <th className="text-left px-5 py-3 font-medium">Interests</th>
                    <th className="text-left px-5 py-3 font-medium">When</th>
                    <th className="text-left px-5 py-3 font-medium">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 && !loading && (
                    <tr><td colSpan={6} className="px-5 py-16 text-center text-[#4B5563]">No leads yet.</td></tr>
                  )}
                  {filteredLeads.map((l) => (
                    <tr key={l.id} className="border-t border-sand-200 hover:bg-sand-100/60 transition-colors">
                      <td className="px-5 py-4 font-medium text-[#111827]">{l.name}</td>
                      <td className="px-5 py-4 text-[#4B5563]"><a href={`mailto:${l.email}`} className="inline-flex items-center gap-1.5 hover:text-jungle-700"><Mail className="h-3.5 w-3.5" /> {l.email}</a></td>
                      <td className="px-5 py-4 text-[#111827]">{l.days}d</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(l.interests || []).map((i) => (<span key={i} className="inline-flex items-center rounded-full bg-sand-100 border border-sand-200 px-2.5 py-1 text-[11px] text-[#4B5563]">{i}</span>))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#4B5563] max-w-[220px] truncate">{l.message || "—"}</td>
                      <td className="px-5 py-4 text-[#4B5563] whitespace-nowrap">{formatDate(l.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-sand-200 bg-sand-50 overflow-hidden" data-testid="admin-bookings-table">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-sand-100 text-[#4B5563] text-xs uppercase tracking-widest">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium">Received</th>
                    <th className="text-left px-5 py-3 font-medium">Guest</th>
                    <th className="text-left px-5 py-3 font-medium">WhatsApp</th>
                    <th className="text-left px-5 py-3 font-medium">Package</th>
                    <th className="text-left px-5 py-3 font-medium">Arrival</th>
                    <th className="text-left px-5 py-3 font-medium">Pax</th>
                    <th className="text-left px-5 py-3 font-medium">Deposit</th>
                    <th className="text-left px-5 py-3 font-medium">Balance</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 && !loading && (
                    <tr><td colSpan={9} className="px-5 py-16 text-center text-[#4B5563]">No bookings yet — they'll appear here after the first successful Stripe deposit.</td></tr>
                  )}
                  {filteredBookings.map((b) => (
                    <tr key={b.booking_id} data-testid={`admin-booking-${b.booking_id}`} className="border-t border-sand-200 hover:bg-sand-100/60 transition-colors">
                      <td className="px-5 py-4 text-[#4B5563] whitespace-nowrap">{formatDate(b.created_at)}</td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-[#111827]">{b.guest_name}</div>
                        <a href={`mailto:${b.guest_email}`} className="text-xs text-[#4B5563] hover:text-jungle-700">{b.guest_email}</a>
                      </td>
                      <td className="px-5 py-4 text-[#4B5563]">
                        <a href={`https://wa.me/${b.guest_whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-jungle-700">
                          <MessageSquare className="h-3.5 w-3.5" /> {b.guest_whatsapp}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-[#111827]">{b.package_name}</td>
                      <td className="px-5 py-4 text-[#4B5563] whitespace-nowrap">{b.arrival_date}</td>
                      <td className="px-5 py-4 text-[#111827]">{b.num_travellers}</td>
                      <td className="px-5 py-4 font-medium text-[#111827]">${Number(b.deposit_amount).toLocaleString()}</td>
                      <td className="px-5 py-4 text-[#4B5563]">${Number(b.balance_due).toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.booking_id, e.target.value)}
                          data-testid={`admin-status-${b.booking_id}`}
                          className="rounded-full bg-sand-100 border border-sand-200 focus:border-jungle-700 outline-none px-3 py-1.5 text-xs font-medium text-[#111827]"
                        >
                          {BOOKING_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ icon: Icon, label, value, small }) {
  return (
    <div className="rounded-2xl border border-sand-200 bg-sand-50 p-5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#4B5563]">
        <Icon className="h-3.5 w-3.5 text-clay-500" /> {label}
      </div>
      <div className={`mt-3 font-display leading-none ${small ? "text-2xl" : "text-4xl"} text-[#111827]`}>{value}</div>
    </div>
  );
}
