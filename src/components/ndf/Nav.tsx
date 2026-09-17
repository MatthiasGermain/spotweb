"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Receipt, PlusCircle, Clock, LayoutList, Users, Settings2, CircleUser, LogOut } from "lucide-react";
import type { ComponentType } from "react";

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link href={href} className={`nav-link${active ? " active" : ""}`}>
      <Icon className="size-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

export default function Nav({
  username,
  isAdmin,
  isTresorier,
}: {
  username: string;
  isAdmin: boolean;
  isTresorier: boolean;
}) {
  const pathname = usePathname();
  const is = (p: string) => pathname === p;

  return (
    <header className="site-header">
      <div className="max-w-7xl mx-auto flex h-14 items-center gap-3 px-4 sm:px-6">
        <Link href="/ndf" className="mr-2 flex items-center gap-2 font-semibold text-sm shrink-0 nav-brand">
          <div className="nav-brand-icon">
            <Receipt className="size-4" />
          </div>
          <span className="hidden sm:inline tracking-tight">Notes de frais</span>
        </Link>

        <nav className="flex items-center gap-0.5 overflow-x-auto">
          <NavLink href="/ndf" icon={PlusCircle} label="Nouvelle NDF" active={is("/ndf")} />
          <NavLink href="/ndf/history" icon={Clock} label="Historique" active={is("/ndf/history")} />
          {isTresorier && (
            <NavLink href="/ndf/admin" icon={LayoutList} label="Gestion NDF" active={is("/ndf/admin")} />
          )}
          {isAdmin && <NavLink href="/ndf/members" icon={Users} label="Membres" active={is("/ndf/members")} />}
          {(isAdmin || isTresorier) && (
            <NavLink href="/ndf/settings" icon={Settings2} label="Paramètres" active={is("/ndf/settings")} />
          )}
        </nav>

        <div className="ml-auto flex items-center gap-0.5 shrink-0">
          <Link href="/ndf/profile" className="nav-link">
            <CircleUser className="size-4" />
            <span className="hidden sm:inline text-xs font-medium">{username}</span>
          </Link>
          <Link href="/ndf/logout" className="nav-link">
            <LogOut className="size-4" />
            <span className="hidden md:inline">Déco.</span>
          </Link>
        </div>
      </div>

      <style>{`
        .site-header {
          position: sticky; top: 0; z-index: 50; width: 100%;
          border-bottom: 1px solid var(--border);
          background: color-mix(in oklch, var(--background) 95%, transparent);
          backdrop-filter: blur(8px);
        }
        .nav-brand { color: var(--foreground); text-decoration: none; }
        .nav-brand-icon {
          display: flex; align-items: center; justify-content: center;
          width: 1.75rem; height: 1.75rem; border-radius: .375rem;
          background: var(--primary); color: var(--primary-foreground);
        }
        .nav-link {
          display: inline-flex; align-items: center; gap: .375rem;
          padding: .375rem .75rem; border-radius: .375rem;
          font-size: .875rem; font-weight: 500;
          color: var(--muted-foreground); text-decoration: none;
          transition: background .15s, color .15s;
        }
        .nav-link:hover { color: var(--foreground); background: var(--accent); }
        .nav-link.active { background: var(--accent); color: var(--foreground); }
      `}</style>
    </header>
  );
}
