import { ArrowUpRight, CheckCircle2, Ticket as TicketIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, PriorityBadge, StatusBadge } from "../components/ui";
import { useTickets } from "../hooks/useTickets";
import { useAuth } from "../hooks/useAuth";
import { PageHeader } from "./CRM";
function Stat({
  label,
  value,
  change,
  tone,
}: {
  label: string;
  value: number;
  change: string;
  tone: string;
}) {
  return (
    <Card className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <TicketIcon size={18} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>
        <ArrowUpRight size={13} /> {change} vs last month
      </small>
    </Card>
  );
}
export function Dashboard() {
  const { tickets } = useTickets();
  const { currentUser } = useAuth();
  const count = (status: string) =>
    tickets.filter((ticket) => ticket.status === status).length;
  const mine = tickets.filter((ticket) => ticket.assignee === currentUser?.name);
  const recent = tickets.slice(0, 5);
  const activity = [12, 19, 15, 26, 21, 31, 24];
  const max = Math.max(...activity);
  return (
    <>
      <PageHeader
        title="Ticket Overview"
        subtitle="Monitor and manage your team's support requests."
        action={
          <Link className="btn btn-secondary" to="/tickets">
            View all tickets <ArrowUpRight size={16} />
          </Link>
        }
      />
      <div className="stats">
        <Stat
          label="Total tickets"
          value={tickets.length + 100}
          change="12%"
          tone="blue"
        />
        <Stat label="Open" value={count("Open")} change="8%" tone="orange" />
        <Stat
          label="In progress"
          value={count("In Progress")}
          change="4%"
          tone="purple"
        />
        <Stat
          label="Pending"
          value={count("Pending")}
          change="2%"
          tone="orange"
        />
        <Stat
          label="Resolved"
          value={count("Resolved") + 65}
          change="18%"
          tone="green"
        />
      </div>
      <div className="dashboard-grid">
        <Card className="chart-card">
          <div className="card-title">
            <div>
              <h2>Ticket activity</h2>
              <p>New requests over the last 7 days</p>
            </div>
            <span className="select-label">Last 7 days</span>
          </div>
          <div className="bar-chart">
            {activity.map((value, index) => (
              <div className="bar-column" key={index}>
                <div
                  className="bar"
                  style={{ height: `${(value / max) * 100}%` }}
                />
                <small>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </small>
              </div>
            ))}
          </div>
        </Card>
        <Card className="status-card">
          <div className="card-title">
            <div>
              <h2>Status overview</h2>
              <p>Current distribution</p>
            </div>
          </div>
          <div className="status-list">
            {[
              ["Open", "blue"],
              ["In Progress", "purple"],
              ["Pending", "orange"],
              ["Resolved", "green"],
              ["Closed", "gray"],
            ].map(([label, tone]) => (
              <div key={label}>
                <span>
                  <i className={`dot ${tone}`} />
                  {label}
                </span>
                <strong>{count(label)}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="dashboard-grid lower">
        <Card className="table-card">
          <div className="card-title">
            <div>
              <h2>Recent tickets</h2>
              <p>Latest requests from your team</p>
            </div>
            <Link to="/tickets">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="mini-list">
            {recent.map((ticket) => (
              <Link to={`/tickets/${ticket.id}`} key={ticket.id}>
                <span className="ticket-avatar">
                  {ticket.requester
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </span>
                <span className="mini-subject">
                  <strong>{ticket.title}</strong>
                  <small>
                    {ticket.id} · {ticket.requester}
                  </small>
                </span>
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </Link>
            ))}
          </div>
        </Card>
        <Card className="priority-card">
          <div className="card-title">
            <div>
              <h2>Priority distribution</h2>
              <p>Tickets by urgency</p>
            </div>
          </div>
          {["Critical", "High", "Medium", "Low"].map((priority) => {
            const total = tickets.filter((t) => t.priority === priority).length;
            return (
              <div className="progress-row" key={priority}>
                <div>
                  <span>{priority}</span>
                  <strong>{total}</strong>
                </div>
                <div className="progress">
                  <i
                    className={`priority-${priority.toLowerCase()}`}
                    style={{
                      width: `${Math.max(10, (total / tickets.length) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
          <div className="assigned">
            <CheckCircle2 size={17} />
            <span>
              <strong>{mine.length} tickets assigned to you</strong>
              <small>Keep the queue moving</small>
            </span>
          </div>
        </Card>
      </div>
    </>
  );
}
