import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BarChart3,
  Briefcase,
  Building2,
  Compass,
  History,
  Home,
  LogOut,
  Megaphone,
  Menu,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import BrandMark from "./BrandMark";
import { useAuth } from "../lib/auth";
import { initials } from "../lib/format";

const GROUPS = [
  {
    title: "עבודה יומית",
    links: [
      { to: "/", label: "דף הבית", icon: Home, end: true },
      { to: "/send-mail", label: "שליחת סטטוס לקוחות", icon: Send },
      { to: "/business-managers/report", label: "דוח מנהלי פיתוח", icon: BarChart3 },
      { to: "/mailing", label: "הודעת תפוצה", icon: Megaphone },
    ],
  },
  {
    title: "מאגרים",
    links: [
      { to: "/agents", label: "סוכנים", icon: Users },
      { to: "/campaigns", label: "קמפיינים וועדים", icon: Building2 },
      { to: "/employees", label: "עובדים ותחומים", icon: Briefcase },
      { to: "/business-managers", label: "מנהלי פיתוח עסקי", icon: Compass, end: true },
    ],
  },
  {
    title: "ניהול",
    admin: true,
    links: [
      { to: "/users", label: "משתמשים", icon: ShieldCheck, end: true },
      { to: "/users/history", label: "היסטוריית פעולות", icon: History },
    ],
  },
];

export default function Shell() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <div className="shell">
      <header className="topbar">
        <b>תלפיות</b>
        <button
          type="button"
          className="icon-btn"
          aria-label="תפריט"
          aria-expanded={open}
          aria-controls="rail"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>
      </header>
      {open && <div className="rail-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside className="rail" id="rail" data-open={open} aria-label="ניווט ראשי">
        <NavLink to="/" className="rail__brand">
          <BrandMark className="rail__brand-mark" />
          <div>
            <b>תלפיות</b>
            <small>FAMILY OFFICE</small>
          </div>
        </NavLink>

        <nav className="rail__nav">
          {GROUPS.filter((g) => !g.admin || user?.isAdmin).map((group) => (
            <div key={group.title}>
              <div className="rail__group">{group.title}</div>
              {group.links.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className="rail__link">
                  <Icon aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="rail__foot">
          <span className="rail__avatar" aria-hidden="true">
            {initials(user)}
          </span>
          <div className="rail__user">
            <b>
              {user?.firstName} {user?.lastName}
            </b>
            <span>{user?.isAdmin ? "מנהל מערכת" : "משתמש"}</span>
          </div>
          <button type="button" className="rail__logout" onClick={logout} aria-label="התנתקות" title="התנתקות">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="main" id="main">
        <Outlet key={location.pathname} />
      </main>
    </div>
  );
}
