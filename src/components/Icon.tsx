import type { SVGProps } from "react";
export function Icon({
  name,
  size = 18,
  ...props
}: { name: string; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>{name}</title>
      {name === "plus" ? (
        <>
          <path d="M12 5v14M5 12h14" />
        </>
      ) : name === "chevron" ? (
        <path d="m9 18 6-6-6-6" />
      ) : name === "search" ? (
        <>
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </>
      ) : name === "close" ? (
        <>
          <path d="m6 6 12 12M18 6 6 18" />
        </>
      ) : name === "bell" ? (
        <>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </>
      ) : name === "file" ? (
        <>
          <path d="M6 2h8l4 4v16H6z" />
          <path d="M14 2v5h5M9 13h6M9 17h6" />
        </>
      ) : name === "grid" ? (
        <>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </>
      ) : name === "layers" ? (
        <>
          <path d="m12 3 8 4-8 4-8-4 8-4Z" />
          <path d="m4 12 8 4 8-4M4 17l8 4 8-4" />
        </>
      ) : name === "settings" ? (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.5 1.5-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.1v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.5-1.5.1-.1A1.7 1.7 0 0 0 9 15a1.7 1.7 0 0 0-1.6-1H7v-2h.4A1.7 1.7 0 0 0 9 11a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.5-1.5.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V6h2.1v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.5 1.5-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2h-.2a1.7 1.7 0 0 0-1.5 1.1Z" />
        </>
      ) : name === "help" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.7 9a2.4 2.4 0 1 1 4.2 1.6c-.9.9-1.9 1.2-1.9 2.6M12 16.5h.01" />
        </>
      ) : name === "menu" ? (
        <>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </>
      ) : (
        <>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8 12h8M12 8v8" />
        </>
      )}
    </svg>
  );
}
