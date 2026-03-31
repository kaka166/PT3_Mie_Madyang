import { Bell, Settings } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 fixed top-0 z-40 w-full">
      <div className="flex justify-between items-center w-full px-6 py-3">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-primary italic">
            Mie Ayam Ma-Dyang
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-all">
              <Settings size={20} />
            </button>
          </div>
          <div className="h-9 w-9 rounded-full bg-neutral-200 overflow-hidden border border-neutral-100">
            <img
              src="/api/placeholder/150/150"
              alt="Owner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
