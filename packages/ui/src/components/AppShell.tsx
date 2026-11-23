"use client";

import type { ReactNode } from "react";

import { QueryProvider } from "../providers/QueryProvider";
import { Header } from "./Header";

interface AppShellProps {
  children: ReactNode;
  appName?: string;
}

export function AppShell({
  children,
  appName = "Demo",
}: AppShellProps) {
  return (
    <QueryProvider>
      <Header appName={appName} />
      <div className="min-h-[calc(100vh-4rem)]">{children}</div>
    </QueryProvider>
  );
}
