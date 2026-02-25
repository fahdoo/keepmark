import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
        <span className="text-2xl font-bold font-serif text-foreground tracking-tight">keepmark</span>
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

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg text-foreground">keepmark</span>
          <p className="text-sm text-muted-foreground">© 2025 Keepmark. Save what matters.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
