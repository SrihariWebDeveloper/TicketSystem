import { useMemo, useState } from "react";
import {
    ArrowLeft,
    Megaphone,
    MoreHorizontal,
    Paperclip,
    Plus,
    Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    Badge,
    Button,
    Card,
    EmptyState,
    Input,
    Select,
} from "../components/ui";
import {
    announcementAudiences,
    announcementPriorities,
    announcementStatuses,
    useAnnouncements,
} from "../hooks/useAnnouncements";
import { useAuth } from "../hooks/useAuth";
import type { Announcement } from "../types";
import { PageHeader } from "./CRM";

function AnnouncementStatus({ status }: { status: Announcement["status"] }) {
    return (
        <Badge tone={status === "Published" ? "success" : status.toLowerCase()}>
            {status}
        </Badge>
    );
}
function AnnouncementPriority({
    priority,
}: {
    priority: Announcement["priority"];
}) {
    return (
        <Badge tone={`announcement-${priority.toLowerCase()}`}>{priority}</Badge>
    );
}
function AnnouncementForm({
    initial,
    onSave,
    onCancel,
}: {
    initial?: Announcement;
    onSave: (
        value: Omit<Announcement, "id" | "author" | "createdAt" | "updatedAt">,
    ) => void;
    onCancel: () => void;
}) {
    const [form, setForm] = useState({
        title: initial?.title ?? "",
        content: initial?.content ?? "",
        audience: initial?.audience ?? ("All Users" as Announcement["audience"]),
        priority: initial?.priority ?? ("Normal" as Announcement["priority"]),
        status: initial?.status ?? ("Draft" as Announcement["status"]),
        publishDate: initial?.publishDate ?? "Aug 25, 2026",
    });
    const [error, setError] = useState("");
    const set = (key: string, value: string) =>
        setForm((item) => ({ ...item, [key]: value }));
    const save = (event: React.FormEvent) => {
        event.preventDefault();
        if (!form.title.trim() || !form.content.trim()) {
            setError("Title and content are required.");
            return;
        }
        onSave(form);
    };
    return (
        <Card className="announcement-form-card">
            <form className="announcement-form" onSubmit={save}>
                <label>
                    <span>Title *</span>
                    <Input
                        value={form.title}
                        onChange={(e) => set("title", e.target.value)}
                        placeholder="Announcement title"
                    />
                </label>
                <label>
                    <span>Description / Content *</span>
                    <textarea
                        className="input announcement-textarea"
                        value={form.content}
                        onChange={(e) => set("content", e.target.value)}
                        placeholder="Write the announcement content..."
                    />
                </label>
                <div className="announcement-form-grid">
                    <label>
                        <span>Audience *</span>
                        <Select
                            value={form.audience}
                            onChange={(e) => set("audience", e.target.value)}
                        >
                            {announcementAudiences.map((value) => (
                                <option key={value}>{value}</option>
                            ))}
                        </Select>
                    </label>
                    <label>
                        <span>Priority *</span>
                        <Select
                            value={form.priority}
                            onChange={(e) => set("priority", e.target.value)}
                        >
                            {announcementPriorities.map((value) => (
                                <option key={value}>{value}</option>
                            ))}
                        </Select>
                    </label>
                    <label>
                        <span>Status</span>
                        <Select
                            value={form.status}
                            onChange={(e) => set("status", e.target.value)}
                        >
                            {announcementStatuses.map((value) => (
                                <option key={value}>{value}</option>
                            ))}
                        </Select>
                    </label>
                    <label>
                        <span>Publish date</span>
                        <Input
                            value={form.publishDate}
                            onChange={(e) => set("publishDate", e.target.value)}
                        />
                    </label>
                </div>
                <div className="announcement-upload">
                    <Paperclip size={17} />
                    <span>
                        <b>Attach a file</b>
                        <small>PDF, PNG, JPG up to 10MB</small>
                    </span>
                </div>
                {error && <p className="form-error">{error}</p>}
                <div className="form-actions">
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {form.status === "Draft" ? "Save Draft" : "Publish"}
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export function AnnouncementsPage() {
    const { announcements } = useAnnouncements();
    const { currentUser } = useAuth();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All");
    const [priority, setPriority] = useState("All");
    const [audience, setAudience] = useState("All");
    const filtered = useMemo(
        () =>
            announcements
                .filter((item) =>
                    `${item.title} ${item.content} ${item.author}`
                        .toLowerCase()
                        .includes(query.toLowerCase()),
                )
                .filter((item) => status === "All" || item.status === status)
                .filter((item) => priority === "All" || item.priority === priority)
                .filter((item) => audience === "All" || item.audience === audience),
        [announcements, query, status, priority, audience],
    );
    return (
        <>
            <PageHeader
                title="Announcements"
                subtitle="Keep your organization informed with the latest updates."
                action={
                    currentUser?.role === "Admin" && (
                        <Link className="btn btn-primary" to="/announcements/new">
                            <Plus size={16} /> Create Announcement
                        </Link>
                    )
                }
            />
            <Card className="table-card announcements-card">
                <div className="table-toolbar announcement-toolbar">
                    <label className="ticket-search">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search announcements..."
                        />
                    </label>
                    <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option>All</option>
                        {announcementStatuses.map((x) => (
                            <option key={x}>{x}</option>
                        ))}
                    </Select>
                    <Select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option>All</option>
                        {announcementPriorities.map((x) => (
                            <option key={x}>{x}</option>
                        ))}
                    </Select>
                    <Select
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                    >
                        <option>All</option>
                        {announcementAudiences.map((x) => (
                            <option key={x}>{x}</option>
                        ))}
                    </Select>
                </div>
                {filtered.length === 0 ? (
                    <EmptyState
                        title="No announcements found"
                        description="Try adjusting your search or filters."
                    />
                ) : (
                    <div className="announcement-list">
                        {filtered.map((item) => (
                            <Link
                                className="announcement-row"
                                to={`/announcements/${item.id}`}
                                key={item.id}
                            >
                                <div className="announcement-mark">
                                    <Megaphone size={17} />
                                </div>
                                <div className="announcement-copy">
                                    <strong>{item.title}</strong>
                                    <p>{item.content}</p>
                                    <small>
                                        {item.id} · {item.author} · Updated {item.updatedAt}
                                    </small>
                                </div>
                                <span className="announcement-audience">{item.audience}</span>
                                <AnnouncementPriority priority={item.priority} />
                                <AnnouncementStatus status={item.status} />
                                <span className="announcement-date">{item.publishDate}</span>
                                <MoreHorizontal size={17} />
                            </Link>
                        ))}
                    </div>
                )}
            </Card>
        </>
    );
}

export function NewAnnouncementPage() {
    const { createAnnouncement } = useAnnouncements();
    const navigate = useNavigate();
    return (
        <>
            <div className="back-link">
                <Link to="/announcements">
                    <ArrowLeft size={16} /> Back to Announcements
                </Link>
            </div>
            <PageHeader
                title="Create Announcement"
                subtitle="Share an update with the right audience."
            />
            <AnnouncementForm
                onSave={(value) => {
                    createAnnouncement(value);
                    navigate("/announcements");
                }}
                onCancel={() => navigate("/announcements")}
            />
        </>
    );
}

export function AnnouncementDetailPage() {
    const { id } = useParams();
    const { announcements, updateAnnouncement, deleteAnnouncement } =
        useAnnouncements();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const item = announcements.find((value) => value.id === id);
    const [editing, setEditing] = useState(false);
    const [confirm, setConfirm] = useState(false);
    if (!item)
        return (
            <EmptyState
                title="Announcement not found"
                description="This announcement may have been deleted."
            />
        );
    const admin = currentUser?.role === "Admin";
    if (editing)
        return (
            <>
                <div className="back-link">
                    <button className="text-button" onClick={() => setEditing(false)}>
                        <ArrowLeft size={16} /> Back to announcement
                    </button>
                </div>
                <PageHeader
                    title="Edit Announcement"
                    subtitle="Update the announcement details."
                />
                <AnnouncementForm
                    initial={item}
                    onSave={(value) => {
                        updateAnnouncement(item.id, value);
                        setEditing(false);
                    }}
                    onCancel={() => setEditing(false)}
                />
            </>
        );
    return (
        <>
            <div className="back-link">
                <Link to="/announcements">
                    <ArrowLeft size={16} /> Back to Announcements
                </Link>
            </div>
            <div className="announcement-detail-header">
                <div>
                    <div className="eyebrow">{item.id}</div>
                    <h1>{item.title}</h1>
                    <div className="badge-row">
                        <AnnouncementStatus status={item.status} />
                        <AnnouncementPriority priority={item.priority} />
                    </div>
                </div>
                {admin && (
                    <div className="announcement-actions">
                        <Button variant="secondary" onClick={() => setEditing(true)}>
                            Edit
                        </Button>
                        {item.status !== "Published" && (
                            <Button
                                onClick={() =>
                                    updateAnnouncement(item.id, { status: "Published" })
                                }
                            >
                                Publish
                            </Button>
                        )}
                        {item.status !== "Archived" && (
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    updateAnnouncement(item.id, { status: "Archived" })
                                }
                            >
                                Archive
                            </Button>
                        )}
                        <button
                            className="icon-button danger"
                            onClick={() => setConfirm(true)}
                            aria-label="Delete announcement"
                        >
                            <Trash2 size={17} />
                        </button>
                    </div>
                )}
            </div>
            <div className="announcement-detail-layout">
                <Card className="announcement-content">
                    <div className="announcement-meta">
                        <span>
                            <b>Author</b>
                            {item.author}
                        </span>
                        <span>
                            <b>Audience</b>
                            {item.audience}
                        </span>
                        <span>
                            <b>Published</b>
                            {item.publishDate}
                        </span>
                        <span>
                            <b>Updated</b>
                            {item.updatedAt}
                        </span>
                    </div>
                    <div className="announcement-body">
                        <p>{item.content}</p>
                    </div>
                </Card>
                <Card className="announcement-side">
                    <h2>Announcement details</h2>
                    <Info label="Status">
                        <AnnouncementStatus status={item.status} />
                    </Info>
                    <Info label="Priority">
                        <AnnouncementPriority priority={item.priority} />
                    </Info>
                    <Info label="Audience">{item.audience}</Info>
                    <Info label="Last updated">{item.updatedAt}</Info>
                </Card>
            </div>
            {confirm && (
                <div className="confirm-backdrop">
                    <Card className="confirm-card">
                        <h2>Delete this announcement?</h2>
                        <p>This action cannot be undone.</p>
                        <div className="form-actions">
                            <Button variant="secondary" onClick={() => setConfirm(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    deleteAnnouncement(item.id);
                                    navigate("/announcements");
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}
function Info({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="announcement-info">
            <span>{label}</span>
            <div>{children}</div>
        </div>
    );
}
