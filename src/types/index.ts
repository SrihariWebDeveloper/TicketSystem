export type TicketStatus =
  | "Open"
  | "In Progress"
  | "Pending"
  | "Resolved"
  | "Closed"
  | "Active"
  | "Onboarding"
  | "On Hold"
  | "Inactive";
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
  schoolId?: string;
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
  id: string;
  title: string;
  content: string;
  author: string;
  audience: "All Users" | "Developers" | "Staff" | "Admins";
  priority: "Normal" | "Important" | "Urgent";
  status: "Draft" | "Scheduled" | "Published" | "Archived";
  publishDate: string;
  createdAt: string;
  updatedAt: string;
}
export interface Tutorial {
  title: string;
  category: string;
  duration: string;
}
