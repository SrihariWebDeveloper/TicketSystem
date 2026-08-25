import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SearchInput } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
const groups = [
  ["Overview", [["Dashboard", "/dashboard"]]],
  [
    "Support",
    [
      ["All Tickets", "/tickets"],
      ["My Tickets", "/my-tickets"],
    ],
  ],
  ["Management", [["Categories", "/categories"]]],
  ["System", [["Settings", "/settings"]]],
] as const;
export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === "Admin";
  return (
    <div className="shell">
      <aside className={open ? "open" : ""}>
        <div className="brand">
          <i>✦</i>
          <span>
            Support<span>Desk</span>
          </span>
          <button onClick={() => setOpen(false)} aria-label="Close navigation">
            <Icon name="close" />
          </button>
        </div>
        <nav>
          {groups.map(([group, links]) => (
            <div className="nav" key={group}>
              <p>{group}</p>
              {links.map(([label, to]) => (
                <NavLink
                  className={({ isActive }) => (isActive ? "active" : "")}
                  to={to}
                  key={label}
                  onClick={() => setOpen(false)}
                >
                  <Icon
                    name={
                      label === "Dashboard"
                        ? "grid"
                        : label === "Categories"
                          ? "layers"
                          : label === "Settings"
                            ? "settings"
                            : "file"
                    }
                    size={17}
                  />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
          {isAdmin && <div className="nav"><p>Administration</p><NavLink className={({ isActive }) => isActive ? "active" : ""} to="/users" onClick={() => setOpen(false)}><Icon name="users" size={17} />Users</NavLink></div>}
        </nav>
        <div className="help">
          <Icon name="help" />
          <span>
            <b>Support center</b>Need a hand?
          </span>
        </div>
        <div className="user">
          <i>{currentUser?.initials}</i>
          <span>
            <b>{currentUser?.name}</b>{currentUser?.role}
          </span>
          <button className="logout-button" onClick={() => { logout(); navigate("/login", { replace: true }); }} aria-label="Log out">Log out</button>
        </div>
      </aside>
      <main>
        <header>
          <button
            className="menub"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Icon name="menu" size={20} />
          </button>
          <div className="headsearch">
            <SearchInput placeholder="Search tickets..." />
          </div>
          <div className="actions">
            <button className="icon-button" aria-label="Notifications">
              <Icon name="bell" size={19} />
            </button>
            <i>{currentUser?.initials}</i>
          </div>
        </header>
        <div className="page">{children}</div>
      </main>
    </div>
  );
}
