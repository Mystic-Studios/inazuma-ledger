import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400">
      <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
        
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-slate-200">INAZUMA</span>
            <span className="text-xs font-bold text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded">BETA</span>
          </div>
          <p className="text-sm text-center md:text-left text-slate-500">
            Database for Inazuma Eleven: Victory Road. <br />
            Not affiliated with Level-5.
          </p>
        </div>
      </div>
      
      <div className="container mt-8 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
        <p>&copy; {new Date().getFullYear()} Inazuma Ledger. All rights reserved.</p>
      </div>
    </footer>
  );
}