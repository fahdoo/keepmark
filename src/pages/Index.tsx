import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bookmark, Search, Sparkles, Palette, MessageCircle, Trash2, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Bookmark, title: "Save links instantly", desc: "Paste any URL and we'll grab the title, favicon, and domain automatically." },
  { icon: Search, title: "Semantic search", desc: "Find saved links using natural language — no need to remember exact titles.", pro: true },
  { icon: MessageCircle, title: "AI chat", desc: "Chat with your bookmarks. Ask questions, get summaries, discover connections.", pro: true },
  { icon: Trash2, title: "Tidy up", desc: "Auto-clean unread links older than 30 days. Keep your inbox fresh.", pro: true },
  { icon: Palette, title: "Color themes", desc: "7 beautiful color themes to make your reading list feel like home.", pro: true },
  { icon: ExternalLink, title: "HN discussions", desc: "One click to find Hacker News discussions for any saved link.", pro: true },
];

const sampleBookmarks = [
  { title: "How to Build a Second Brain", domain: "fortelabs.com", time: "2h ago" },
  { title: "The Case for Boring Technology", domain: "boringtechnology.club", time: "5h ago" },
  { title: "Designing for the Web in 2025", domain: "frankchimero.com", time: "1d ago" },
  { title: "Why We Sleep — Summary", domain: "nateliason.com", time: "2d ago" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <span className="text-2xl font-bold font-serif text-foreground tracking-tight">shiori</span>
        <Button variant="outline" size="sm" className="rounded-full" asChild>
          <Link to="/auth">Sign in</Link>
        </Button>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-serif text-foreground leading-tight mb-6"
        >
          Your read-it-later
          <br />
          <span className="text-primary italic">inbox</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg text-muted-foreground max-w-md mx-auto mb-8"
        >
          Save links, search them semantically, and chat with your bookmarks. Minimal, warm, and delightful.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button size="lg" className="rounded-full px-8 text-base font-medium" asChild>
            <Link to="/auth">Get started — it's free</Link>
          </Button>
        </motion.div>

        {/* Inbox preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-14 max-w-lg mx-auto"
        >
          <Card className="shadow-lg border-border/60">
            <div className="flex items-center gap-2 px-5 pt-4 pb-2">
              <span className="text-sm font-medium text-foreground">Inbox</span>
              <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{sampleBookmarks.length}</span>
              <span className="ml-4 text-sm text-muted-foreground">Archive</span>
            </div>
            <CardContent className="p-0 divide-y divide-border">
              {sampleBookmarks.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    {b.domain[0].toUpperCase()}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{b.title}</p>
                    <p className="text-xs text-muted-foreground">{b.domain}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3 h-3" />{b.time}
                  </span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-serif text-foreground text-center mb-12">
          Everything you need to <span className="text-primary italic">remember</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow border-border/60">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <f.icon className="w-5 h-5 text-primary" />
                    {f.pro && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        Pro
                      </span>
                    )}
                  </div>
                  <h3 className="font-sans text-base font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-serif text-foreground text-center mb-4">
          Simple pricing
        </h2>
        <p className="text-center text-muted-foreground mb-12">Start free, upgrade when you're ready.</p>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <Card className="border-border/60">
            <CardContent className="p-6">
              <h3 className="font-sans text-lg font-semibold text-foreground mb-1">Free</h3>
              <p className="text-3xl font-serif text-foreground mb-4">$0<span className="text-base text-muted-foreground font-sans">/mo</span></p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Bookmark className="w-4 h-4 text-primary" /> Save unlimited links</li>
                <li className="flex items-center gap-2"><Search className="w-4 h-4 text-primary" /> Basic text search</li>
                <li className="flex items-center gap-2"><Trash2 className="w-4 h-4 text-primary" /> Inbox & archive</li>
              </ul>
              <Button variant="outline" className="w-full mt-6 rounded-full">Get started</Button>
            </CardContent>
          </Card>
          {/* Pro */}
          <Card className="border-primary/40 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-sans text-lg font-semibold text-foreground">Pro</h3>
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-serif text-foreground mb-4">$5<span className="text-base text-muted-foreground font-sans">/mo</span></p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Bookmark className="w-4 h-4 text-primary" /> Everything in Free</li>
                <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-primary" /> AI Chat & semantic search</li>
                <li className="flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> 7 color themes</li>
                <li className="flex items-center gap-2"><Trash2 className="w-4 h-4 text-primary" /> Tidy up & HN discussions</li>
              </ul>
              <Button className="w-full mt-6 rounded-full">Upgrade to Pro</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg text-foreground">shiori</span>
          <p className="text-sm text-muted-foreground">© 2025 Shiori. Save what matters.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
