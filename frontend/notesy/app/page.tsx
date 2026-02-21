import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background font-sans p-6 text-center">
      {/* Decorative background element for aesthetic appeal */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] -z-10" />

      {/* Main Logo / Title */}
      <div className="space-y-4">
        <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-foreground">
          NOTES<span className="text-primary">Y</span>
        </h1>
        
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-border" />
          <p className="text-muted-foreground font-medium tracking-widest uppercase text-xs sm:text-sm">
            Simple Notes with RBAC
          </p>
          <div className="h-px w-8 bg-border" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center">
        <Link 
          href="/login" 
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-[0.98] text-center"
        >
          Sign In
        </Link>

        <Link 
          href="/register" 
          className="px-8 py-3 border border-border bg-card text-foreground font-semibold rounded-xl hover:bg-secondary transition-all active:scale-[0.98] text-center"
        >
          Create Account
        </Link>
      </div>

      {/* Bottom Detail */}
      <footer className="absolute bottom-8 text-muted-foreground/50 text-xs font-mono">
        v1.0.0 // SECURE ENCRYPTED STORAGE
      </footer>
    </div>
  );
}