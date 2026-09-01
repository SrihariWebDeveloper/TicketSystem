/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { tickets as seed } from "../data/mockData";
import { useAuth } from "./useAuth";
import type {
  Category,
  Priority,
  Ticket,
  TicketActivity,
  TicketStatus,
} from "../types";

export const statuses: TicketStatus[] = [
  "Open",
  "In Progress",
  "Pending",
  "Resolved",
  "Closed",
];
export const priorities: Priority[] = ["Low", "Medium", "High", "Critical"];
export const categories: Category[] = [
  "Account",
  "Technical",
  "Billing",
  "Access",
  "Product",
  "General",
];
export const assignees = [
  "Alex Morgan",
  "Jordan Lee",
  "Ava Thompson",
  "Nora Adams",
  "Michael Chen",
  "Unassigned",
];

type NewTicket = Omit<Ticket, "id" | "created" | "updated">;
type TicketContextValue = {
  tickets: Ticket[];
  activities: Record<string, TicketActivity[]>;
  createTicket: (ticket: NewTicket) => Ticket;
  updateTicket: (
    id: string,
    changes: Partial<Ticket>,
    activity?: TicketActivity,
  ) => void;
  addComment: (id: string, body: string, internal?: boolean) => void;
};
const TicketContext = createContext<TicketContextValue | null>(null);
const storageKey = "crm-tickets-v1";
const activityKey = "crm-activities-v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function now() {
  return "Just now";
}
function initialActivities(rows: Ticket[]): Record<string, TicketActivity[]> {
  return Object.fromEntries(
    rows.map((ticket) => [
      ticket.id,
      [
        {
          id: `${ticket.id}-created`,
          type: "created",
          actor: ticket.requester,
          text: "created this ticket.",
          timestamp: ticket.created,
        },
      ],
    ]),
  );
}

export function TicketProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [ticketRows, setTicketRows] = useState<Ticket[]>(() =>
    read(storageKey, seed),
  );
  const [activityRows, setActivityRows] = useState<
    Record<string, TicketActivity[]>
  >(() => read(activityKey, initialActivities(seed)));
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(ticketRows));
  }, [ticketRows]);
  useEffect(() => {
    localStorage.setItem(activityKey, JSON.stringify(activityRows));
  }, [activityRows]);
  const addActivity = (id: string, activity: TicketActivity) =>
    setActivityRows((rows) => ({
      ...rows,
      [id]: [...(rows[id] ?? []), activity],
    }));
  const createTicket = (ticket: NewTicket) => {
    const created: Ticket = {
      ...ticket,
      id: `TK-${1001 + ticketRows.length}`,
      created: "Aug 25, 2026",
      updated: now(),
      schoolId: ticket.schoolId,
    };
    setTicketRows((rows) => [created, ...rows]);
    setActivityRows((rows) => ({
      ...rows,
      [created.id]: [
        {
          id: `${created.id}-created`,
          type: "created",
          actor: ticket.requester,
          text: "created this ticket.",
          timestamp: created.created,
        },
      ],
    }));
    return created;
  };
  const updateTicket = (
    id: string,
    changes: Partial<Ticket>,
    activity?: TicketActivity,
  ) => {
    setTicketRows((rows) =>
      rows.map((ticket) =>
        ticket.id === id ? { ...ticket, ...changes, updated: now() } : ticket,
      ),
    );
    if (activity) addActivity(id, activity);
  };
  const addComment = (id: string, body: string, internal = false) => {
    addActivity(id, {
      id: `${id}-${Date.now()}`,
      type: internal ? "note" : "comment",
      actor: currentUser?.name ?? "Support Admin",
      text: body,
      timestamp: now(),
    });
    setTicketRows((rows) =>
      rows.map((ticket) =>
        ticket.id === id ? { ...ticket, updated: now() } : ticket,
      ),
    );
  };
  return (
    <TicketContext.Provider
      value={{
        tickets: ticketRows,
        activities: activityRows,
        createTicket,
        updateTicket,
        addComment,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}
export function useTickets() {
  const value = useContext(TicketContext);
  if (!value) throw new Error("useTickets must be used inside TicketProvider");
  return value;
}
