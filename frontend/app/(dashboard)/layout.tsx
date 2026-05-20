"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../src/components/dashboard/navbar";
import Sidebar from "../../src/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [valid, setValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setValid(true);
    } else {
      document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
      router.push("/login");
    }
  }, [router]);

  if (!isMounted || !valid) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f9f9f9]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c93535]" />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#f4f5f7] overflow-hidden">
      {/* Sidebar: full height from top */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main area: everything to the right of sidebar */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 overflow-hidden">
        {/* Navbar at top of content area */}
        <Navbar onMenuClick={() => setIsOpen(!isOpen)} />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
