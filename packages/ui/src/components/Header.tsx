"use client";

import { usePathname } from "next/navigation";

interface HeaderProps {
  appName?: string;
}

export function Header({
  appName = "Demo",
}: HeaderProps) {
  const activePath = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/posts", label: "Posts" },
  ];

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <a
          href="/"
          className="app-brand"
          aria-label={`${appName} home`}
        >
          <span className="app-brand-mark">
            D
          </span>
          <span className="app-brand-name">
            {appName}
          </span>
        </a>

        <nav className="app-nav" aria-label="Primary navigation">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? activePath === "/"
                : activePath.startsWith(link.href);

            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={active ? "active" : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
