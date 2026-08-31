import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  Clock3,
  FileText,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  PriorityBadge,
  Select,
  StatusBadge,
} from "../components/ui";
import {
  assignees,
  categories,
  priorities,
  statuses,
  useTickets,
} from "../hooks/useTickets";
import type { Category, Priority, Ticket, TicketStatus } from "../types";
import { useAuth } from "../hooks/useAuth";
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="heading">
      <div>
        <div className="eyebrow">Workspace / Support</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
function Row({
  ticket,
  selected,
  toggle,
  open,
}: {
  ticket: Ticket;
  selected: boolean;
  toggle: () => void;
  open: () => void;
}) {
  return (
    <tr>
      <td>
        <input type="checkbox" checked={selected} onChange={toggle} />
      </td>
      <td>
        <button className="ticket-link" onClick={open}>
          <strong>#{ticket.id.replace("SUP-", "TK-")}</strong>
          <span>{ticket.title}</span>
        </button>
      </td>
      <td>{ticket.requester}</td>
      <td>
        <Badge>{ticket.category}</Badge>
      </td>
      <td>
        <PriorityBadge priority={ticket.priority} />
      </td>
      <td>{ticket.assignee}</td>
      <td>
        <StatusBadge status={ticket.status} />
      </td>
      <td>{ticket.created}</td>
      <td>{ticket.updated}</td>
      <td>
        <button
          className="icon-button"
          onClick={open}
          aria-label={`View ${ticket.id}`}
        >
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  );
}
export function TicketsPage({ mine = false }: { mine?: boolean }) {
  const { tickets, updateTicket } = useTickets();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("search") ?? ""),
    [status, setStatus] = useState("All"),
    [priority, setPriority] = useState("All"),
    [category, setCategory] = useState("All"),
    [assignee, setAssignee] = useState("All"),
    [sort, setSort] = useState("newest"),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<string[]>([]),
    [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const base = mine
    ? tickets.filter((t) => t.assignee === currentUser?.name)
    : tickets;
  const rows = useMemo(
    () =>
      [...base]
        .filter((t) =>
          `${t.id} ${t.title} ${t.requester}`
            .toLowerCase()
            .includes(q.toLowerCase()),
        )
        .filter((t) => status === "All" || t.status === status)
        .filter((t) => priority === "All" || t.priority === priority)
        .filter((t) => category === "All" || t.category === category)
        .filter((t) => assignee === "All" || t.assignee === assignee)
        .sort((a, b) =>
          sort === "title"
            ? a.title.localeCompare(b.title)
            : sort === "priority"
              ? priorities.indexOf(b.priority as Priority) -
              priorities.indexOf(a.priority as Priority)
              : b.id.localeCompare(a.id),
        ),
    [base, q, status, priority, category, assignee, sort],
  );
  const shown = rows.slice((page - 1) * 8, page * 8);
  const reset = () => {
    setQ("");
    setStatus("All");
    setPriority("All");
    setCategory("All");
    setAssignee("All");
    setPage(1);
  };
  const all = shown.length > 0 && shown.every((t) => selected.includes(t.id));
  return (
    <>
      <PageHeader
        title={mine ? "My Tickets" : "Tickets"}
        subtitle={
          mine
            ? "Stay on top of requests assigned to you."
            : "View and manage all customer support tickets."
        }
        action={
          <Link className="btn btn-primary" to="/tickets/new">
            <Plus size={16} /> Create ticket
          </Link>
        }
      />
      {mine && (
        <div className="summary-row">
          {[
            ["Assigned", base.length],
            ["Open", base.filter((t) => t.status === "Open").length],
            [
              "In Progress",
              base.filter((t) => t.status === "In Progress").length,
            ],
            ["Resolved", base.filter((t) => t.status === "Resolved").length],
          ].map((x) => (
            <Card key={String(x[0])}>
              <span>{x[0]}</span>
              <strong>{x[1]}</strong>
            </Card>
          ))}
        </div>
      )}
      <Card className="table-card">
        <div className="table-toolbar">
          <label className="ticket-search">
            <Input
              placeholder="Search tickets..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            {statuses.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>All</option>
            {priorities.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            {categories.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>
          <Select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option>All</option>
            {assignees.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="title">Subject A-Z</option>
            <option value="priority">Priority</option>
          </Select>
          <button className="text-button" onClick={reset}>
            Reset
          </button>
        </div>
        {selected.length > 0 && (
          <div className="bulkbar">
            <b>{selected.length} selected</b>
            <Select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  selected.forEach((id) =>
                    updateTicket(id, {
                      status: e.target.value as TicketStatus,
                    }),
                  );
                  setSelected([]);
                }
              }}
            >
              <option value="">Bulk status</option>
              {statuses.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
          </div>
        )}
        {rows.length === 0 ? (
          <EmptyState
            title="No tickets found"
            description="Try adjusting your search or filters."
            action={
              <Button variant="secondary" onClick={reset}>
                Reset filters
              </Button>
            }
          />
        ) : (
          <>
            <div className="desktop-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={all}
                        onChange={() =>
                          setSelected(
                            all
                              ? selected.filter(
                                (id) => !shown.some((t) => t.id === id),
                              )
                              : [
                                ...new Set([
                                  ...selected,
                                  ...shown.map((t) => t.id),
                                ]),
                              ],
                          )
                        }
                      />
                    </th>
                    <th>Ticket</th>
                    <th>Requester</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Assignee</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {shown.map((t) => (
                    <Row
                      key={t.id}
                      ticket={t}
                      selected={selected.includes(t.id)}
                      toggle={() =>
                        setSelected((s) =>
                          s.includes(t.id)
                            ? s.filter((id) => id !== t.id)
                            : [...s, t.id],
                        )
                      }
                      open={() => setActiveTicket(t)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mobile-tickets">
              {shown.map((t) => (
                <button
                  className="mobile-ticket"
                  onClick={() => setActiveTicket(t)}
                  key={t.id}
                >
                  <div>
                    <b>#{t.id.replace("SUP-", "TK-")}</b>
                    <StatusBadge status={t.status} />
                  </div>
                  <h3>{t.title}</h3>
                  <p>
                    {t.requester} · {t.category}
                  </p>
                  <footer>
                    <PriorityBadge priority={t.priority} />
                    <span>{t.updated}</span>
                  </footer>
                </button>
              ))}
            </div>
            <div className="pagination">
              <span>
                Showing {(page - 1) * 8 + 1}-{Math.min(page * 8, rows.length)}{" "}
                of {rows.length}
              </span>
              <div>
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  disabled={page * 8 >= rows.length}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
      {activeTicket && (
        <TicketQuickView
          ticket={activeTicket}
          close={() => setActiveTicket(null)}
          update={updateTicket}
        />
      )}
    </>
  );
}
function TicketQuickView({
  ticket,
  close,
  update,
}: {
  ticket: Ticket;
  close: () => void;
  update: (id: string, changes: Partial<Ticket>) => void;
}) {
  const edit = (
    key: "status" | "priority" | "assignee" | "category",
    value: string,
  ) => update(ticket.id, { [key]: value } as Partial<Ticket>);
  return (
    <div
      className="quick-view-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <section
        className="quick-view"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
      >
        <div className="quick-view-header">
          <div>
            <span className="eyebrow">#{ticket.id.replace("SUP-", "TK-")}</span>
            <h2 id="quick-view-title">Ticket information</h2>
          </div>
          <button
            className="icon-button"
            onClick={close}
            aria-label="Close ticket information"
          >
            <X size={19} />
          </button>
        </div>
        <div className="quick-view-subject">
          <h3>{ticket.title}</h3>
          <div>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
        <div className="quick-view-grid">
          <Info
            label="Requester"
            value={ticket.requester}
            extra={ticket.email}
          />
          <Info label="Created" value={ticket.created} />
          <label className="info-control">
            <span>Status</span>
            <Select
              value={ticket.status}
              onChange={(e) => edit("status", e.target.value)}
            >
              {statuses.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
          </label>
          <label className="info-control">
            <span>Priority</span>
            <Select
              value={ticket.priority}
              onChange={(e) => edit("priority", e.target.value)}
            >
              {priorities.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
          </label>
          <label className="info-control">
            <span>Assignee</span>
            <Select
              value={ticket.assignee}
              onChange={(e) => edit("assignee", e.target.value)}
            >
              {assignees.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
          </label>
          <label className="info-control">
            <span>Category</span>
            <Select
              value={ticket.category}
              onChange={(e) => edit("category", e.target.value)}
            >
              {categories.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
          </label>
        </div>
        <div className="quick-view-description">
          <span>Description</span>
          <p>{ticket.description}</p>
        </div>
        <div className="quick-view-tags">
          <span>Tags</span>
          <div>
            {ticket.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
        <div className="quick-view-footer">
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
        </div>
      </section>
    </div>
  );
}
function Field({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={wide ? "field wide" : "field"}>
      <span>{label}</span>
      {children}
    </label>
  );
}
export function CreateTicketPage() {
  const { createTicket } = useTickets();
  const navigate = useNavigate();
  const [f, setF] = useState({
    requester: "",
    email: "",
    title: "",
    description: "",
    category: "Account" as Category,
    priority: "Medium" as Priority,
    assignee: "Unassigned",
    status: "Open" as TicketStatus,
    tags: "",
  }),
    [error, setError] = useState("");
  const set = (key: string, value: string) =>
    setF((x) => ({ ...x, [key]: value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.requester || !f.title || !f.description) {
      setError("Requester, subject, and description are required.");
      return;
    }
    const t = createTicket({
      ...f,
      tags: f.tags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    });
    navigate(`/tickets/${t.id}`);
  };
  return (
    <>
      <PageHeader
        title="Create New Ticket"
        subtitle="Capture a request and route it to the right teammate."
      />
      <Card className="form-card">
        <form onSubmit={submit}>
          <div className="form-grid">
            <Field label="Requester *">
              <Input
                value={f.requester}
                onChange={(e) => set("requester", e.target.value)}
              />
            </Field>
            <Field label="Requester email">
              <Input
                type="email"
                value={f.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
            <Field label="Subject *" wide>
              <Input
                value={f.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </Field>
            <Field label="Description *" wide>
              <textarea
                className="input textarea"
                value={f.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
            <Field label="Category *">
              <Select
                value={f.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {categories.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </Select>
            </Field>
            <Field label="Priority *">
              <Select
                value={f.priority}
                onChange={(e) => set("priority", e.target.value)}
              >
                {priorities.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </Select>
            </Field>
            <Field label="Assignee">
              <Select
                value={f.assignee}
                onChange={(e) => set("assignee", e.target.value)}
              >
                {assignees.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={f.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {statuses.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </Select>
            </Field>
            <Field label="Tags" wide>
              <Input
                value={f.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="login, account"
              />
            </Field>
            <div className="upload wide">
              <Paperclip size={18} />
              <span>
                <b>Attach files</b> or drag and drop
                <small>PNG, JPG, PDF up to 10MB</small>
              </span>
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/tickets")}
            >
              Cancel
            </Button>
            <Button type="submit">Create ticket</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
export function TicketDetailPage() {
  const { id } = useParams();
  const { tickets, activities, updateTicket, addComment } = useTickets();
  const { currentUser } = useAuth();
  const t = tickets.find((x) => x.id === id) ?? tickets[0];
  const [comment, setComment] = useState(""),
    [note, setNote] = useState(false);
  if (!t)
    return (
      <EmptyState
        title="Ticket not found"
        description="This ticket may have been removed."
      />
    );
  const change = (
    key: "status" | "priority" | "assignee" | "category",
    value: string,
  ) =>
    updateTicket(t.id, { [key]: value } as Partial<Ticket>, {
      id: String(Date.now()),
      type:
        key === "assignee"
          ? "assigned"
          : key === "status"
            ? "status"
            : "priority",
      actor: currentUser?.name ?? "Support Admin",
      text: `${key} changed to ${value}.`,
      timestamp: "Just now",
    });
  return (
    <>
      <div className="back-link">
        <Link to="/tickets">
          <ArrowLeft size={16} /> Back to Tickets
        </Link>
      </div>
      <div className="detail-header">
        <div>
          <div className="eyebrow">#{t.id.replace("SUP-", "TK-")}</div>
          <h1>{t.title}</h1>
          <div className="badge-row">
            <StatusBadge status={t.status} />
            <PriorityBadge priority={t.priority} />
          </div>
        </div>
        <Button variant="secondary">
          <MoreHorizontal size={16} /> More
        </Button>
      </div>
      <div className="detail-layout">
        <div className="detail-main">
          <Card className="detail-card">
            <h2>Requester message</h2>
            <p className="message">{t.description}</p>
            <div className="attachment">
              <FileText size={17} /> support-context.pdf
            </div>
          </Card>
          <Card className="detail-card">
            <div className="section-heading">
              <h2>Activity</h2>
              <span>{(activities[t.id] ?? []).length} events</span>
            </div>
            <div className="timeline">
              {(activities[t.id] ?? []).map((a) => (
                <div className="timeline-item" key={a.id}>
                  <div className="timeline-icon">
                    <Check size={14} />
                  </div>
                  <div>
                    <b>{a.actor}</b>
                    <p>{a.text}</p>
                    <small>
                      <Clock3 size={12} /> {a.timestamp}
                    </small>
                  </div>
                </div>
              ))}
            </div>
            <div className="composer">
              <div className="composer-tabs">
                <button
                  className={!note ? "selected" : ""}
                  onClick={() => setNote(false)}
                >
                  Reply
                </button>
                <button
                  className={note ? "selected" : ""}
                  onClick={() => setNote(true)}
                >
                  Internal note
                </button>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a reply..."
              />
              <div className="composer-footer">
                <Button
                  onClick={() => {
                    if (comment.trim()) {
                      addComment(t.id, comment, note);
                      setComment("");
                    }
                  }}
                  disabled={!comment.trim()}
                >
                  <Send size={15} /> Add comment
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <aside className="detail-sidebar">
          <Card className="detail-card">
            <h2>Ticket information</h2>
            <Info label="Requester" value={t.requester} extra={t.email} />
            {(["assignee", "status", "priority", "category"] as const).map(
              (key) => (
                <label className="info-control" key={key}>
                  <span>{key}</span>
                  <Select
                    value={t[key]}
                    onChange={(e) => change(key, e.target.value)}
                  >
                    {(key === "assignee"
                      ? assignees
                      : key === "status"
                        ? statuses
                        : key === "priority"
                          ? priorities
                          : categories
                    ).map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </Select>
                </label>
              ),
            )}
            <Info label="Created" value={t.created} />
            <Info label="Last updated" value={t.updated} />
            <div className="tag-list">
              <span>Tags</span>
              <div>
                {t.tags.map((x) => (
                  <Badge key={x}>{x}</Badge>
                ))}
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}
function Info({
  label,
  value,
  extra,
}: {
  label: string;
  value: string;
  extra?: string;
}) {
  return (
    <div className="info">
      <span>{label}</span>
      <b>{value}</b>
      {extra && <small>{extra}</small>}
    </div>
  );
}
export function CategoriesPage() {
  const { tickets } = useTickets();
  const [rows, setRows] = useState(categories);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const save = () => {
    if (name.trim()) {
      if (editing) {
        setRows(rows.map((row) => row === editing ? name.trim() as Category : row));
      } else {
        setRows([...rows, name.trim() as Category]);
      }
      setName("");
      setEditing(null);
    }
  };
  const filteredRows = rows.filter((row) => row.toLowerCase().includes(query.toLowerCase()));
  const edit = (row: string) => { setEditing(row); setName(row); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <>

      <PageHeader
        title="Categories"
        subtitle="Organize and route support requests."
        action={
          <div className="category-form">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New category name"
              required
            />
            <Button onClick={save}>{editing ? "Update category" : "Add category"}</Button>
            {editing && <button className="text-button" onClick={() => { setEditing(null); setName(""); }}>Cancel</button>}
          </div>
        }
      />
      <Card className="table-card">
        <div className="card-title">
          <div>
            <h2>Ticket categories</h2>
            <p>Manage the labels used by your support team.</p>
          </div>
          <label className="category-search"><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search categories..." /></label>
        </div>
        <div className="desktop-table">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Ticket count</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((x) => (
                <tr key={x}>
                  <td>
                    <b>{x}</b>
                  </td>
                  <td>{x} related support requests</td>
                  <td>{tickets.filter((t) => t.category === x).length}</td>
                  <td>
                    <Badge tone="success">Active</Badge>
                  </td>
                  <td>
                    <button className="text-button category-edit" onClick={() => edit(x)}>
                      Edit
                    </button>
                    <button
                      className="icon-button danger"
                      onClick={() => setRows(rows.filter((y) => y !== x))}
                      aria-label={`Delete ${x}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mobile-category-list">
          {filteredRows.map((x) => (
            <div className="mobile-category" key={x}>
              <div className="mobile-category-heading">
                <div>
                  <strong>{x}</strong>
                  <Badge tone="success">Active</Badge>
                </div>
                <button className="text-button category-edit" onClick={() => edit(x)}>
                  Edit
                </button>
                <button
                  className="icon-button danger"
                  onClick={() => setRows(rows.filter((y) => y !== x))}
                  aria-label={`Delete ${x}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p>{x} related support requests</p>
              <small>{tickets.filter((t) => t.category === x).length} tickets</small>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
export function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your workspace preferences and notifications."
      />
      <div className="settings-grid">
        <Card className="settings-card">
          <h2>Profile</h2>
          <p>Your support workspace identity.</p>
          <div className="profile-large">AM</div>
          <Field label="Name">
            <Input defaultValue="Alex Morgan" />
          </Field>
          <Field label="Email">
            <Input defaultValue="alex.morgan@acme.co" />
          </Field>
          <Button>Save profile</Button>
        </Card>
        <Card className="settings-card">
          <h2>Ticket preferences</h2>
          <p>Choose defaults for new tickets.</p>
          <Field label="Default status">
            <Select defaultValue="Open">
              <option>Open</option>
              <option>Pending</option>
            </Select>
          </Field>
          <Field label="Default priority">
            <Select defaultValue="Medium">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </Select>
          </Field>
          <label className="toggle-row">
            <span>Email notifications</span>
            <button
              className={notifications ? "toggle on" : "toggle"}
              onClick={() => setNotifications(!notifications)}
            >
              <i />
            </button>
          </label>
          <Button>Save preferences</Button>
        </Card>
      </div>
    </>
  );
}
