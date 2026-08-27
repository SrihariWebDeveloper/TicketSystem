import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import type { ChangeEvent } from "react";
import type { Priority, TicketStatus } from "../types";
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="input" {...props} />;
}
export function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className="input" {...props}>
      {children}
    </select>
  );
}
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`card ${className}`}>{children}</section>;
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function StatusBadge({ status }: { status: TicketStatus }) {
  return <Badge tone={status.toLowerCase().replace(" ", "-")}>{status}</Badge>;
}
export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge tone={`priority-${priority.toLowerCase()}`}>{priority}</Badge>;
}
export function SearchInput({
  placeholder = "Search",
  value,
  onChange,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="search">
      <input placeholder={placeholder} value={value} onChange={onChange} />
    </label>
  );
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">⌁</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
