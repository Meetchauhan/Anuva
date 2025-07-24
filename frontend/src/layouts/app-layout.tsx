import React, { ReactNode } from "react";
import Sidebar from "../components/layout/sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row text-normal">
      <Sidebar />
      <main className="flex-grow bg-neutral-950 overflow-auto">
        {children}
      </main>
    </div>
  );
}
