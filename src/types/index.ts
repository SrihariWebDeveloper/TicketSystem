export type TicketStatus =
  | "Open"
  | "In Progress"
  | "Pending"
  | "Resolved"
  | "Closed";
export type Priority = "Low" | "Medium" | "High" | "Critical";
export type Category =
  | "Account"
  | "Technical"
  | "Billing"
  | "Access"
  | "Product"
  | "General"
  | "LMS";
export type ActivityType =
  | "created"
  | "assigned"
  | "status"
  | "priority"
  | "comment"
  | "note";
export interface Ticket {
  id: string;
  title: string;
  requester: string;
  email: string;
  category: Category;
  priority: Priority;
  assignee: string;
  status: TicketStatus;
  created: string;
  updated: string;
  description: string;
  tags: string[];
}
export interface TicketActivity {
  id: string;
  type: ActivityType;
  actor: string;
  text: string;
  timestamp: string;
}
export interface User {
  name: string;
  email: string;
  role: string;
  initials: string;
  password?: string;
  status?: "Active" | "Inactive";
}
export interface CategoryRecord {
  name: Category;
  description: string;
  count: number;
  active: boolean;
}
export interface Announcement {
  title: string;
  date: string;
  body: string;
  label: string;
}
export interface Tutorial {
  title: string;
  category: string;
  duration: string;
}
