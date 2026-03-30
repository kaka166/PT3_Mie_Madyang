import Navbar from "../../src/components/dashboard/navbar";
import Sidebar from "../../src/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="ml-64 flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}