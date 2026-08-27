import { useState, type ReactNode } from "react";
import { NavLink, useNavigate} from "react-router-dom";
import { Icon } from "../components/Icon";
import { SearchInput } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { useTickets } from "../hooks/useTickets";
const groups = [
  ["Overview", [["Dashboard", "/dashboard"]]],
  [
    "Support",
    [
      ["All Tickets", "/tickets"],
      ["My Tickets", "/my-tickets"],
    ],
  ],
  ["Management", [["Categories", "/categories"], ["Schools", "/schools"]]],
  ["Communication", [["Announcements", "/announcements"]]],
] as const;
export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === "Admin";
  const { tickets } = useTickets();
  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const matches = query.trim() ? tickets.filter((ticket) => `${ticket.id} ${ticket.title} ${ticket.requester}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];
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
                          : label === "Schools"
                            ? "school"
                          : label === "Announcements"
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
          <div className="headsearch header-search-wrap">
            <SearchInput placeholder="Search tickets..." value={query} onChange={(event) => setQuery(event.target.value)} />
            {matches.length > 0 && <div className="header-search-results">{matches.map((ticket) => <NavLink to={`/tickets?search=${encodeURIComponent(ticket.title)}`} onClick={() => setQuery("")} key={ticket.id}><strong>#{ticket.id.replace("SUP-", "TK-")}</strong><span>{ticket.title}</span></NavLink>)}</div>}
          </div>
          <div className="actions">
            <button className="icon-button notification-button" onClick={() => setShowNotifications(!showNotifications)} aria-label="Notifications">
              <Icon name="bell" size={19} />
            </button>
            {showNotifications && <div className="notification-popover"><strong>Notifications</strong><p>{tickets.filter((ticket) => ticket.status === "Open").length} open tickets need attention.</p><NavLink to="/tickets" onClick={() => setShowNotifications(false)}>View tickets</NavLink></div>}
            <button className="profile-avatar" onClick={() => navigate("/settings")} aria-label={`Open settings for ${currentUser?.name}`}><i>{currentUser?.initials}</i></button>
          </div>
        </header>
        <div className="page">{children}</div>
      </main>
    </div>
  );
}
