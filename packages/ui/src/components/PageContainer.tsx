import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <main className={`shared-page ${className}`}>
      <div className="shared-page-card">
        {children}
      </div>
    </main>
  );
}
