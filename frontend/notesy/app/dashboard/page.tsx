"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  FileText,
  Sparkles,
  LogOut,
  Search,
  StickyNote,
  LayoutDashboard,
  Clock,
  ChevronDown,
} from "lucide-react";



/* ─────────────── MOCK API (replace with your real api import) ─────────────── */
const api = {
  get: async (_url: string) => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("mockNotes") : null;
    return { data: stored ? JSON.parse(stored) : [] };
  },
  post: async (_url: string, body: { title: string }) => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("mockNotes") : null;
    const notes = stored ? JSON.parse(stored) : [];
    notes.unshift({ id: Date.now().toString(), title: body.title, createdAt: new Date().toISOString() });
    localStorage.setItem("mockNotes", JSON.stringify(notes));
    return { data: notes };
  },
  delete: async (url: string) => {
    const id = url.split("/").pop();
    const stored = typeof window !== "undefined" ? localStorage.getItem("mockNotes") : null;
    const notes = stored ? JSON.parse(stored) : [];
    const filtered = notes.filter((n: { id: string }) => n.id !== id);
    localStorage.setItem("mockNotes", JSON.stringify(filtered));
    return { data: filtered };
  },
};

/* ─────────────── TOAST SYSTEM ─────────────── */
type ToastType = "success" | "error";
interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const show = useCallback((message: string, type: ToastType) => {
    const id = counter.current++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return {
    toasts,
    success: (msg: string) => show(msg, "success"),
    error: (msg: string) => show(msg, "error"),
  };
}

function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-slide-up rounded-xl border px-5 py-3 text-sm font-medium shadow-2xl backdrop-blur-xl transition-all ${
            t.type === "success"
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ─────────────── DASHBOARD ─────────────── */
export default function Dashboard() {
  const [notes, setNotes] = useState<
    { id: string; title: string; createdAt?: string }[]
  >([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const toast = useToast();

  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  /* ── Load user after mount ── */
  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role");

    if (!t) {
      // For demo, set a mock token so the dashboard works
      localStorage.setItem("token", "demo");
      localStorage.setItem("role", "admin");
      setToken("demo");
      setRole("admin");
    } else {
      setToken(t);
      setRole(r);
    }
    loadNotes();
  }, []);

  /* ── Keyboard shortcut ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((s) => !s);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ── Load notes ── */
  const loadNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  /* ── Add note ── */
  const addNote = async () => {
    if (!title.trim()) return toast.error("Write something first");
    try {
      await api.post("/notes", { title: title.trim() });
      setTitle("");
      toast.success("Note created");
      loadNotes();
    } catch {
      toast.error("Error adding note");
    }
  };

  /* ── Delete note ── */
  const deleteNote = async (id: string) => {
    setDeletingId(id);
    setTimeout(async () => {
      try {
        await api.delete(`/notes/${id}`);
        toast.success("Note deleted");
        loadNotes();
      } catch {
        toast.error("Error deleting note");
      } finally {
        setDeletingId(null);
      }
    }, 300);
  };

  /* ── Logout ── */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  /* ── Filter notes ── */
  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ── Format time ── */
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "just now";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Ambient background glow ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* ══════════════ NAVBAR ══════════════ */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Notes
              </h1>
              <p className="text-xs text-muted-foreground">
                {notes.length} {notes.length === 1 ? "note" : "notes"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setShowSearch((s) => !s)}
              className="flex items-center gap-2 rounded-xl border border-border/50 bg-secondary/50 px-3 py-2 text-xs text-muted-foreground transition-all hover:border-border hover:bg-secondary hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded-md border border-border bg-background/50 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
                {"K"}
              </kbd>
            </button>

            {/* Role badge */}
            {role && (
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {role}
              </span>
            )}

            {/* Logout */}
            <button
              onClick={logout}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 text-muted-foreground transition-all hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-6 py-8">
        {/* ══════════════ SEARCH BAR (collapsible) ══════════════ */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            showSearch ? "mb-6 max-h-16 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border/50 bg-secondary/30 py-3 pl-11 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary/50 focus:bg-secondary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* ══════════════ ADD NOTE INPUT ══════════════ */}
        <div className="group mb-10 rounded-2xl border border-border/50 bg-card/50 p-1.5 shadow-lg shadow-background/50 backdrop-blur-sm transition-all focus-within:border-primary/30 focus-within:shadow-primary/5">
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <input
              ref={inputRef}
              className="flex-1 bg-transparent py-3 text-sm text-foreground placeholder-muted-foreground outline-none"
              placeholder="What's on your mind?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addNote();
              }}
            />
            <button
              onClick={addNote}
              disabled={!title.trim()}
              className="flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 disabled:opacity-30 disabled:hover:brightness-100"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        {/* ══════════════ STATS ROW ══════════════ */}
        {!loading && notes.length > 0 && (
          <div className="mb-8 grid grid-cols-3 gap-3">
            {[
              {
                label: "Total Notes",
                value: notes.length,
                icon: FileText,
              },
              {
                label: "This Session",
                value: notes.filter(
                  (n) =>
                    n.createdAt &&
                    Date.now() - new Date(n.createdAt).getTime() < 86400000
                ).length,
                icon: Clock,
              },
              {
                label: "Characters",
                value: notes.reduce((acc, n) => acc + n.title.length, 0),
                icon: StickyNote,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/50 bg-card/30 p-4 backdrop-blur-sm"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ══════════════ LOADING STATE ══════════════ */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6 h-12 w-12">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-border border-t-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Loading your notes...</p>
          </div>
        )}

        {/* ══════════════ EMPTY STATE ══════════════ */}
        {!loading && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-border/50 bg-card/50">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              No notes yet
            </h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              Start capturing your thoughts. Your notes will appear here as
              beautiful cards.
            </p>
            <button
              onClick={() => inputRef.current?.focus()}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110"
            >
              Create your first note
            </button>
          </div>
        )}

        {/* ══════════════ NOTES LIST ══════════════ */}
        {!loading && filteredNotes.length > 0 && (
          <div className="space-y-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">
                {searchQuery
                  ? `${filteredNotes.length} result${filteredNotes.length !== 1 ? "s" : ""}`
                  : "All Notes"}
              </h2>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>

            {filteredNotes.map((note, i) => (
              <div
                key={note.id}
                style={{
                  animationDelay: `${i * 50}ms`,
                }}
                className={`animate-fade-in group relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/70 hover:shadow-lg hover:shadow-background/50 ${
                  deletingId === note.id
                    ? "translate-x-[-20px] scale-95 opacity-0"
                    : ""
                }`}
              >
                {/* Left accent bar */}
                <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-primary/40 transition-all group-hover:bg-primary" />

                <div className="flex items-center justify-between p-4 pl-5">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/50 text-sm font-medium text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      {note.title.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {note.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatTime(note.createdAt)}
                      </p>
                    </div>
                  </div>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      aria-label={`Delete note: ${note.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── No search results ── */}
        {!loading && searchQuery && filteredNotes.length === 0 && notes.length > 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Search className="mb-4 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No notes matching &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}
      </main>

      {/* ── Toasts ── */}
      <ToastContainer toasts={toast.toasts} />

      {/* ── Animations ── */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out both;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out both;
        }
      `}</style>
    </div>
  );
}
