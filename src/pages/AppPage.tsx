import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Bookmark, Search, Plus, Archive, Inbox, Trash2, LogOut, Clock, ExternalLink,
  Sparkles, MessageCircle, Palette, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Session } from "@supabase/supabase-js";

type BookmarkRow = {
  id: string;
  url: string;
  title: string | null;
  favicon_url: string | null;
  domain: string | null;
  description: string | null;
  summary: string | null;
  archived: boolean;
  created_at: string;
};

const THEMES = [
  { name: "Magenta", bg: "320 15% 95%", fg: "320 20% 15%", accent: "320 45% 45%" },
  { name: "Ocean", bg: "210 30% 96%", fg: "210 25% 15%", accent: "210 70% 50%" },
  { name: "Forest", bg: "140 20% 95%", fg: "140 20% 15%", accent: "140 50% 40%" },
  { name: "Lavender", bg: "270 25% 96%", fg: "270 20% 18%", accent: "270 55% 55%" },
  { name: "Rose", bg: "350 30% 96%", fg: "350 20% 18%", accent: "350 65% 55%" },
  { name: "Slate", bg: "220 15% 95%", fg: "220 15% 15%", accent: "220 40% 45%" },
  { name: "Midnight", bg: "240 10% 10%", fg: "240 10% 90%", accent: "45 80% 55%" },
];

const AppPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [view, setView] = useState<"inbox" | "archive">("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [isPro] = useState(true); // flag for premium features
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(0);
  const [showThemes, setShowThemes] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/auth");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchBookmarks = useCallback(async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("archived", view === "archive")
      .order("created_at", { ascending: false });
    if (error) { toast.error(error.message); return; }
    setBookmarks(data || []);
  }, [session, view]);

  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  const extractDomain = (url: string) => {
    try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
  };

  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !session) return;
    setAdding(true);
    try {
      let url = newUrl.trim();
      if (!url.startsWith("http")) url = "https://" + url;
      const domain = extractDomain(url);
      const faviconUrl = `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;

      // Try to fetch metadata via edge function
      let title = domain;
      let description: string | null = null;
      let summary: string | null = null;
      try {
        const { data } = await supabase.functions.invoke("fetch-metadata", { body: { url } });
        if (data?.title) title = data.title;
        if (data?.description) description = data.description;
        if (data?.summary) summary = data.summary;
      } catch { /* fallback to domain */ }

      const { error } = await supabase.from("bookmarks").insert({
        url, title, domain, favicon_url: faviconUrl, description, summary, user_id: session.user.id,
      });
      if (error) throw error;
      setNewUrl("");
      setShowAdd(false);
      fetchBookmarks();
      toast.success("Bookmark saved!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) toast.error(error.message);
    else fetchBookmarks();
  };

  const toggleArchive = async (id: string, archived: boolean) => {
    const { error } = await supabase.from("bookmarks").update({ archived: !archived }).eq("id", id);
    if (error) toast.error(error.message);
    else fetchBookmarks();
  };

  const tidyUp = async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { error, count } = await supabase
      .from("bookmarks")
      .delete()
      .eq("archived", false)
      .lt("created_at", thirtyDaysAgo);
    if (error) toast.error(error.message);
    else { toast.success(`Tidied up! Removed old bookmarks.`); fetchBookmarks(); }
  };

  const findHNDiscussion = (url: string) => {
    window.open(`https://hn.algolia.com/?q=${encodeURIComponent(url)}`, "_blank");
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    const allMessages = [...chatMessages, userMsg];
    setChatMessages(allMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const bookmarkContext = bookmarks.map(b => `${b.title} - ${b.url}`).join("\n");
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            { role: "system", content: `You are a helpful assistant. The user has these bookmarks:\n${bookmarkContext}\n\nAnswer questions about their bookmarks.` },
            ...allMessages,
          ],
        },
      });
      if (error) throw error;
      // Non-streaming response
      const content = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
      setChatMessages(prev => [...prev, { role: "assistant", content }]);
    } catch (err: any) {
      toast.error(err.message || "Chat error");
    } finally {
      setChatLoading(false);
    }
  };

  const applyTheme = (index: number) => {
    const theme = THEMES[index];
    document.documentElement.style.setProperty("--background", theme.bg);
    document.documentElement.style.setProperty("--foreground", theme.fg);
    document.documentElement.style.setProperty("--primary", theme.accent);
    document.documentElement.style.setProperty("--accent", theme.accent);
    document.documentElement.style.setProperty("--ring", theme.accent);
    setCurrentTheme(index);
    setShowThemes(false);
  };

  const filtered = bookmarks.filter(b =>
    !searchQuery || (b.title?.toLowerCase().includes(searchQuery.toLowerCase()) || b.url.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-serif font-bold text-foreground">keepmark</span>
          <div className="flex items-center gap-2">
            {isPro && (
              <>
                <Button variant="ghost" size="icon" onClick={() => setShowChat(!showChat)} title="AI Chat">
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowThemes(!showThemes)} title="Themes">
                  <Palette className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={tidyUp} title="Tidy up">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Theme picker */}
        <AnimatePresence>
          {showThemes && isPro && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex gap-2 flex-wrap">
                {THEMES.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => applyTheme(i)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      currentTheme === i ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setView("inbox")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              view === "inbox" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Inbox className="w-4 h-4 inline mr-1" />Inbox
          </button>
          <button
            onClick={() => setView("archive")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              view === "archive" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Archive className="w-4 h-4 inline mr-1" />Archive
          </button>
          <div className="flex-1" />
          <Button size="sm" onClick={() => setShowAdd(!showAdd)} className="rounded-full">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showAdd && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={addBookmark}
              className="mb-4 overflow-hidden"
            >
              <div className="flex gap-2">
                <Input
                  placeholder="Paste a URL..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="rounded-full flex-1"
                  autoFocus
                />
                <Button type="submit" disabled={adding} className="rounded-full">
                  {adding ? "..." : "Save"}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Bookmarks list */}
        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground text-sm"
              >
                {searchQuery ? "No bookmarks match your search." : view === "inbox" ? "Your inbox is empty. Add a link!" : "No archived bookmarks."}
              </motion.div>
            )}
            {filtered.map((b) => (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <img
                  src={b.favicon_url || ""}
                  alt=""
                  className="w-5 h-5 rounded"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
                    {b.title || b.domain || b.url}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {b.summary || b.description || b.domain}
                  </p>
                </a>
                <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <Clock className="w-3 h-3" />{timeAgo(b.created_at)}
                </span>
                <div className="hidden group-hover:flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleArchive(b.id, b.archived)} title={b.archived ? "Unarchive" : "Archive"}>
                    {b.archived ? <Inbox className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                  </Button>
                  {isPro && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => findHNDiscussion(b.url)} title="HN Discussions">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteBookmark(b.id)} title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* AI Chat panel */}
      <AnimatePresence>
        {showChat && isPro && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-card border-l border-border shadow-lg flex flex-col z-50"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm text-foreground">AI Chat</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowChat(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center mt-8">Ask me anything about your bookmarks!</p>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`text-sm ${m.role === "user" ? "text-foreground ml-6" : "text-muted-foreground mr-6"}`}>
                  <div className={`rounded-lg px-3 py-2 ${m.role === "user" ? "bg-primary/10" : "bg-muted"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading && <p className="text-xs text-muted-foreground animate-pulse">Thinking...</p>}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); sendChat(); }}
              className="p-4 border-t border-border flex gap-2"
            >
              <Input
                placeholder="Ask about your bookmarks..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="rounded-full text-sm"
                disabled={chatLoading}
              />
              <Button type="submit" size="sm" className="rounded-full" disabled={chatLoading}>
                Send
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppPage;
