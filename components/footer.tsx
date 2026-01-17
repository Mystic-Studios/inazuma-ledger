import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 py-6 mt-auto">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
           <span className="font-black text-slate-200 text-sm">INAZUMA</span>
           <span>&copy; {new Date().getFullYear()} Inazuma Ledger</span>
        </div>
        
        <p className="text-center md:text-right">
          Database for Inazuma Eleven: Victory Road. Not affiliated with Level-5.
        </p>
      </div>
    </footer>
  );
}