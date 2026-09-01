import {
  Building2,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  MapPin,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge, Button, Card, EmptyState, Input, Select } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { useTickets } from "../hooks/useTickets";
import {
  readSchools,
  schoolStatuses,
  type School,
  type SchoolStatus,
} from "../data/schools";

function SchoolStatusBadge({ status }: { status: SchoolStatus }) {
  const tone =
    status === "Active"
      ? "success"
      : status === "Onboarding"
        ? "neutral"
        : status === "On Hold"
          ? "pending"
          : "closed";
  return <Badge tone={tone}>{status}</Badge>;
}

function getSchoolTicketStats(schoolId: string, tickets: ReturnType<typeof useTickets>["tickets"]) {
  const rows = tickets.filter((ticket) => ticket.schoolId === schoolId);
  return {
    total: rows.length,
    open: rows.filter((ticket) => ticket.status === "Open").length,
    inProgress: rows.filter((ticket) => ticket.status === "In Progress").length,
    pending: rows.filter((ticket) => ticket.status === "Pending").length,
    resolved: rows.filter((ticket) => ticket.status === "Resolved").length,
  };
}

function getSchoolLastActivity(schoolId: string, tickets: ReturnType<typeof useTickets>["tickets"]) {
  const rows = tickets
    .filter((ticket) => ticket.schoolId === schoolId)
    .sort((a, b) => b.updated.localeCompare(a.updated));
  return rows[0]?.updated ?? "No activity";
}

function SchoolFormModal({
  school,
  mode,
  onClose,
  onSave,
}: {
  school?: School | null;
  mode: "add" | "edit";
  onClose: () => void;
  onSave: (payload: School) => void;
}) {
  const [form, setForm] = useState<School>(
    school ?? {
      id: "",
      name: "",
      code: "",
      location: "",
      email: "",
      phone: "",
      contactPerson: "",
      status: "Active",
      createdAt: new Date().toISOString().slice(0, 10),
    },
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (school) {
      setForm(school);
    }
  }, [school]);

  const updateField = (field: keyof School, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = () => {
    const nextName = form.name.trim();
    const nextLocation = form.location.trim();
    const nextEmail = form.email.trim();
    const nextStatus = form.status || "Active";

    if (!nextName || !nextLocation || !nextEmail || !nextStatus) {
      setError("School name, location, email, and status are required.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail);
    if (!isValidEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    const payload: School = {
      ...form,
      id: school?.id ?? `school-${Date.now()}`,
      name: nextName,
      location: nextLocation,
      email: nextEmail,
      status: nextStatus,
      code: form.code.trim(),
      phone: form.phone.trim(),
      contactPerson: form.contactPerson.trim(),
      createdAt: school?.createdAt ?? form.createdAt,
    };

    onSave(payload);
  };

  return (
    <div className="school-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="school-modal card" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <h2>{mode === "add" ? "Add School" : "Edit School"}</h2>
            <p>{mode === "add" ? "Create a new school profile." : "Update school details."}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close school form">
            <X size={18} />
          </button>
        </div>

        <div className="modal-columns">
          <label className="field">
            <span>School Name *</span>
            <Input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </label>
          <label className="field">
            <span>School Code</span>
            <Input
              value={form.code}
              onChange={(event) => updateField("code", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Location *</span>
            <Input
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Email *</span>
            <Input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Phone</span>
            <Input
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Contact Person</span>
            <Input
              value={form.contactPerson}
              onChange={(event) => updateField("contactPerson", event.target.value)}
            />
          </label>
          <label className="field wide">
            <span>Status</span>
            <Select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              {schoolStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={submit}>
            {mode === "add" ? "Add School" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SchoolsPage() {
  const { id } = useParams();
  const { tickets } = useTickets();
  const { currentUser } = useAuth();
  const [schools, setSchools] = useState<School[]>(() => readSchools());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editSchool, setEditSchool] = useState<School | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const canManageSchools = currentUser?.role === "Admin";

  useEffect(() => {
    localStorage.setItem("crm-schools-v1", JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    if (id) {
      const nextSchool = schools.find((school) => school.id === id) ?? null;
      if (nextSchool) setSelectedSchool(nextSchool);
    }
  }, [id, schools]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const summary = useMemo(() => {
    const total = schools.length;
    return {
      total,
      active: schools.filter((school) => school.status === "Active").length,
      onboarding: schools.filter((school) => school.status === "Onboarding").length,
      onHold: schools.filter((school) => school.status === "On Hold").length,
    };
  }, [schools]);

  const locations = useMemo(
    () => ["All", ...new Set(schools.map((school) => school.location))],
    [schools],
  );

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const matchesQuery = `${school.name} ${school.location} ${school.email}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || school.status === statusFilter;
      const matchesLocation =
        locationFilter === "All" || school.location === locationFilter;
      return matchesQuery && matchesStatus && matchesLocation;
    });
  }, [schools, query, statusFilter, locationFilter]);

  const createOrUpdateSchool = (payload: School) => {
    const duplicateNameExists = schools.some(
      (school) =>
        school.name.trim().toLowerCase() === payload.name.trim().toLowerCase() &&
        school.id !== payload.id,
    );

    if (duplicateNameExists) {
      setToast("A school with this name already exists.");
      return;
    }

    const nextSchools = payload.id
      ? schools.map((school) => (school.id === payload.id ? payload : school))
      : [payload, ...schools];

    setSchools(nextSchools);
    setShowModal(false);
    setEditSchool(null);
    setToast(payload.id ? "School updated successfully." : "School added successfully.");
  };

  const clearFilters = () => {
    setQuery("");
    setStatusFilter("All");
    setLocationFilter("All");
  };

  return (
    <>
      <div className="heading">
        <div>
          <div className="eyebrow">Workspace / CRM</div>
          <h1>Schools</h1>
          <p>Manage schools and track their support activity.</p>
        </div>
        {canManageSchools && (
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add School
          </Button>
        )}
      </div>

      <div className="summary-row schools-summary">
        <Card>
          <span>Total Schools</span>
          <strong>{summary.total}</strong>
          <small>{summary.total} total</small>
        </Card>
        <Card>
          <span>Active</span>
          <strong>{summary.active}</strong>
          <small>{summary.active} active</small>
        </Card>
        <Card>
          <span>Onboarding</span>
          <strong>{summary.onboarding}</strong>
          <small>{summary.onboarding} onboarding</small>
        </Card>
        <Card>
          <span>On Hold</span>
          <strong>{summary.onHold}</strong>
          <small>{summary.onHold} on hold</small>
        </Card>
      </div>

      <Card className="table-card">
        <div className="table-toolbar">
          <label className="ticket-search">
            <Search size={15} />
            <Input
              placeholder="Search schools..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="filter-field">
            <span>Status</span>
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="All">All Statuses</option>
              {schoolStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </label>
          <label className="filter-field">
            <span>Location</span>
            <Select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
              <option value="All">All Locations</option>
              {locations
                .filter((location) => location !== "All")
                .map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
            </Select>
          </label>
          <button className="text-button" onClick={clearFilters} type="button">
            Clear filters
          </button>
        </div>

        {filteredSchools.length === 0 ? (
          <EmptyState
            title="No schools found"
            description="Try adjusting your search or filters."
            action={
              <Button variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <div className="desktop-table">
              <table>
                <thead>
                  <tr>
                    <th>School</th>
                    <th>Location</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Total Tickets</th>
                    <th>Open Tickets</th>
                    <th>Last Activity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchools.map((school) => {
                    const totalTickets = tickets.filter((ticket) => ticket.schoolId === school.id).length;
                    const openTickets = tickets.filter(
                      (ticket) => ticket.schoolId === school.id && ticket.status === "Open",
                    ).length;
                    const lastActivity = getSchoolLastActivity(school.id, tickets);

                    return (
                      <tr key={school.id}>
                        <td>
                          <button
                            type="button"
                            className="school-table-link"
                            onClick={() => setSelectedSchool(school)}
                          >
                            <span className="school-icon">
                              <Building2 size={13} />
                            </span>
                            <div>
                              <strong>{school.name}</strong>
                              <small>{school.code || "No code"}</small>
                            </div>
                          </button>
                        </td>
                        <td>{school.location}</td>
                        <td>
                          <div className="school-contact">
                            <span>{school.email}</span>
                            <small>{school.contactPerson || "No contact person"}</small>
                          </div>
                        </td>
                        <td>
                          <SchoolStatusBadge status={school.status} />
                        </td>
                        <td>{totalTickets}</td>
                        <td>{openTickets}</td>
                        <td>{lastActivity}</td>
                        <td>
                          <div className="inline-actions">
                            <button
                              type="button"
                              className="icon-button"
                              aria-label={`View ${school.name}`}
                              onClick={() => setSelectedSchool(school)}
                            >
                              <Eye size={15} />
                            </button>
                            {canManageSchools && (
                              <>
                                <button
                                  type="button"
                                  className="icon-button"
                                  aria-label={`Edit ${school.name}`}
                                  onClick={() => {
                                    setEditSchool(school);
                                    setShowModal(true);
                                  }}
                                >
                                  <Edit3 size={15} />
                                </button>
                                <select
                                  className="inline-status-select"
                                  value={school.status}
                                  onChange={(event) => {
                                    const nextStatus = event.target.value as SchoolStatus;
                                    const updated = { ...school, status: nextStatus };
                                    setSchools((current) => current.map((item) =>
                                      item.id === school.id ? updated : item,
                                    ));
                                    setToast(`School status changed to ${nextStatus}.`);
                                  }}
                                  aria-label={`Update status for ${school.name}`}
                                >
                                  {schoolStatuses.map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mobile-tickets">
              {filteredSchools.map((school) => {
                const stats = getSchoolTicketStats(school.id, tickets);
                return (
                  <button
                    type="button"
                    className="mobile-ticket school-mobile-card"
                    onClick={() => setSelectedSchool(school)}
                    key={school.id}
                  >
                    <div className="school-mobile-head">
                      <div>
                        <strong>{school.name}</strong>
                        <small>{school.location}</small>
                      </div>
                      <SchoolStatusBadge status={school.status} />
                    </div>
                    <p>{school.email}</p>
                    <footer>
                      <span>{stats.total} tickets</span>
                      <span>{stats.open} open</span>
                    </footer>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {showModal && (
        <SchoolFormModal
          school={editSchool}
          mode={editSchool ? "edit" : "add"}
          onClose={() => {
            setShowModal(false);
            setEditSchool(null);
          }}
          onSave={createOrUpdateSchool}
        />
      )}

      {selectedSchool && (
        <SchoolDetailModal
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
          onStatusChange={(schoolId, nextStatus) => {
            setSchools((current) =>
              current.map((school) =>
                school.id === schoolId ? { ...school, status: nextStatus } : school,
              ),
            );
            setToast(`School status changed to ${nextStatus}.`);
          }}
          onEdit={(school) => {
            setEditSchool(school);
            setSelectedSchool(null);
            setShowModal(true);
          }}
        />
      )}

      {toast && <div className="toast success">{toast}</div>}
    </>
  );
}

function SchoolDetailModal({
  school,
  onClose,
  onStatusChange,
  onEdit,
}: {
  school: School;
  onClose: () => void;
  onStatusChange: (schoolId: string, status: SchoolStatus) => void;
  onEdit: (school: School) => void;
}) {
  
  const { tickets } = useTickets();
  const { currentUser } = useAuth();

  const canManageSchools = currentUser?.role === "Admin";

  const schoolTickets = tickets.filter((ticket) => ticket.schoolId === school.id);
  const stats = getSchoolTicketStats(school.id, tickets);
  const timeline = [
    ...schoolTickets.map((ticket) => ({
      label: `Ticket #${ticket.id} created`,
      timestamp: ticket.created,
    })),
    ...schoolTickets.slice(0, 3).map((ticket) => ({
      label: `Ticket #${ticket.id} status changed to ${ticket.status}`,
      timestamp: ticket.updated,
    })),
    {
      label: `School status changed to ${school.status}`,
      timestamp: school.createdAt,
    },
  ].slice(0, 4);

  return (
    <div
      className="school-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="school-detail-modal card" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <h2>{school.name}</h2>
            <p>{school.location}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close school details">
            <X size={18} />
          </button>
        </div>

        <div className="detail-header school-detail-header">
          <div className="badge-row">
            <MapPin size={14} />
            <span>{school.location}</span>
            <SchoolStatusBadge status={school.status} />
          </div>
          {canManageSchools && (
          <div className="detail-actions">
            <Button variant="secondary" onClick={() => onEdit(school)}>
              <Edit3 size={15} /> Edit School
            </Button>
            <Select
              value={school.status}
              onChange={(event) => onStatusChange(school.id, event.target.value as SchoolStatus)}
            >
              {schoolStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>
          )}
        </div>

        <div className="school-modal-content">
          <div className="school-info-grid">
            <div className="info"><span>School Name</span><b>{school.name}</b></div>
            <div className="info"><span>School Code</span><b>{school.code || "—"}</b></div>
            <div className="info"><span>Location</span><b>{school.location}</b></div>
            <div className="info"><span>Contact Person</span><b>{school.contactPerson || "—"}</b></div>
            <div className="info"><span>Email</span><b>{school.email}</b></div>
            <div className="info"><span>Phone</span><b>{school.phone || "—"}</b></div>
            <div className="info full-width"><span>Status</span><b><SchoolStatusBadge status={school.status} /></b></div>
          </div>

          <div className="school-summary-grid">
            <div className="school-summary-box">
              <span>Total Tickets</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="school-summary-box">
              <span>Open</span>
              <strong>{stats.open}</strong>
            </div>
            <div className="school-summary-box">
              <span>In Progress</span>
              <strong>{stats.inProgress}</strong>
            </div>
            <div className="school-summary-box">
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </div>
            <div className="school-summary-box">
              <span>Resolved</span>
              <strong>{stats.resolved}</strong>
            </div>
          </div>

          <div className="school-ticket-list">
            <h3>School tickets</h3>
            {schoolTickets.length === 0 ? (
              <p className="empty-small">No tickets for this school yet.</p>
            ) : (
              <div className="mini-ticket-list">
                {schoolTickets.map((ticket) => (
                  <div key={ticket.id} className="mini-ticket-item">
                    <div>
                      <strong>#{ticket.id.replace("SUP-", "TK-")}</strong>
                      <span>{ticket.title}</span>
                    </div>
                    <Badge tone={ticket.status.toLowerCase().replace(" ", "-")}>{ticket.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="timeline-block">
            <h3>Recent activity</h3>
            <div className="timeline">
              {timeline.map((item, index) => (
                <div className="timeline-item" key={`${item.label}-${index}`}>
                  <div className="timeline-icon">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <p>{item.label}</p>
                    <small>
                      <Clock3 size={12} /> {item.timestamp}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
