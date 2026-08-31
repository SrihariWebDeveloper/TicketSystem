/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { announcementSeed } from "../data/announcements";
import type { Announcement } from "../types";

export const announcementStatuses: Announcement["status"][] = [
  "Draft",
  "Scheduled",
  "Published",
  "Archived",
];
export const announcementPriorities: Announcement["priority"][] = [
  "Normal",
  "Important",
  "Urgent",
];
export const announcementAudiences: Announcement["audience"][] = [
  "All Users",
  "Developers",
  "Staff",
  "Admins",
];
type AnnouncementContextValue = {
  announcements: Announcement[];
  createAnnouncement: (
    announcement: Omit<
      Announcement,
      "id" | "author" | "createdAt" | "updatedAt"
    >,
  ) => Announcement;
  updateAnnouncement: (id: string, changes: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
};
const Context = createContext<AnnouncementContextValue | null>(null);
const key = "supporthub_announcements";
function read(): Announcement[] {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as Announcement[]) : announcementSeed;
  } catch {
    return announcementSeed;
  }
}
export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState(read);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(announcements));
  }, [announcements]);
  const createAnnouncement = (
    input: Omit<Announcement, "id" | "author" | "createdAt" | "updatedAt">,
  ) => {
    const item: Announcement = {
      ...input,
      id: `ANN-${1001 + announcements.length}`,
      author: "Alex Morgan",
      createdAt: "Aug 25, 2026",
      updatedAt: "Just now",
    };
    setAnnouncements((rows) => [item, ...rows]);
    return item;
  };
  const updateAnnouncement = (id: string, changes: Partial<Announcement>) =>
    setAnnouncements((rows) =>
      rows.map((item) =>
        item.id === id ? { ...item, ...changes, updatedAt: "Just now" } : item,
      ),
    );
  const deleteAnnouncement = (id: string) =>
    setAnnouncements((rows) => rows.filter((item) => item.id !== id));
  return (
    <Context.Provider
      value={{
        announcements,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAnnouncements() {
  const value = useContext(Context);
  if (!value)
    throw new Error(
      "useAnnouncements must be used inside AnnouncementProvider",
    );
  return value;
}
