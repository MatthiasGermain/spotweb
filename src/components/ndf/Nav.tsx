"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Nav({
  displayName,
  isAdmin,
  isTresorier,
}: {
  displayName: string;
  isAdmin: boolean;
  isTresorier: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick() {
      setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <Link href="/ndf" className="site-logo">
          Notes de frais
        </Link>

        <nav className="site-nav">
          <Link href="/ndf">✚ Nouvelle NDF</Link>
          <Link href="/ndf/history">Historique</Link>

          <div className={`dropdown${open ? " open" : ""}`} ref={ref}>
            <button
              className="dropdown-btn"
              aria-haspopup="true"
              aria-expanded={open}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((v) => !v);
              }}
            >
              {displayName} <span style={{ fontSize: ".65rem", opacity: 0.7 }}>▾</span>
            </button>
            <div className="dropdown-menu" role="menu">
              <Link href="/ndf/profile">👤 Mon profil</Link>
              {(isAdmin || isTresorier) && <div className="dropdown-divider" />}
              {isAdmin && (
                <Link href="/ndf/members" className="dm-special">
                  👥 Gestion des membres
                </Link>
              )}
              {isTresorier && (
                <Link href="/ndf/admin" className="dm-special">
                  ⚙ Gestion des NDF
                </Link>
              )}
            </div>
          </div>

          <Link href="/ndf/logout" className="nav-logout">
            Déconnexion
          </Link>
        </nav>
      </header>

      <style>{`
        header.site-header {
          background: #1e3a5f; color: white;
          padding: 0 28px;
          display: flex; align-items: center; justify-content: space-between;
          height: 52px; position: sticky; top: 0; z-index: 200;
          box-shadow: 0 1px 4px rgba(0,0,0,.25);
        }
        header.site-header .site-logo {
          font-size: .95rem; font-weight: 700; color: white;
          text-decoration: none; white-space: nowrap;
        }
        .site-nav { display: flex; align-items: center; gap: 6px; }
        .site-nav > a, .site-nav > .dropdown > .dropdown-btn {
          color: rgba(255,255,255,.82); text-decoration: none; font-size: .83rem;
          padding: 6px 10px; border-radius: 6px; white-space: nowrap;
          transition: background .15s, color .15s;
          background: none; border: none; cursor: pointer; font-family: inherit;
          display: inline-flex; align-items: center; gap: 4px;
        }
        .site-nav > a:hover,
        .site-nav > .dropdown > .dropdown-btn:hover {
          background: rgba(255,255,255,.12); color: white;
        }
        .site-nav > a.nav-logout {
          color: rgba(255,255,255,.6); font-size: .78rem;
        }
        .site-nav > a.nav-logout:hover { color: white; background: rgba(255,255,255,.1); }

        .dropdown { position: relative; }
        .dropdown-menu {
          display: none; position: absolute; right: 0; top: calc(100% + 6px);
          background: white; border-radius: 8px; min-width: 196px;
          box-shadow: 0 4px 20px rgba(0,0,0,.18); overflow: hidden; z-index: 300;
        }
        .dropdown.open .dropdown-menu { display: block; }
        .dropdown-menu a {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 16px; color: #1e293b; text-decoration: none;
          font-size: .87rem; transition: background .12s;
        }
        .dropdown-menu a:hover { background: #f1f5f9; }
        .dropdown-menu a.dm-special {
          color: #1e3a5f; font-weight: 600;
        }
        .dropdown-divider {
          height: 1px; background: #e2e8f0; margin: 4px 0;
        }
      `}</style>
    </>
  );
}
