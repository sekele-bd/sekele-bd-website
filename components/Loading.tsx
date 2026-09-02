"use client";

type LoadingVariant = "page" | "section" | "inline" | "overlay";

type LoadingProps = {
  /** page = full viewport, section = block area, inline = small spinner, overlay = absolute cover */
  variant?: LoadingVariant;
  /** Optional label under the spinner */
  label?: string;
  /** Extra classes on the outer wrapper */
  className?: string;
};

export default function Loading({
  variant = "section",
  label,
  className = "",
}: LoadingProps) {
  const spinner = (
    <span
      className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-rose-600"
      aria-hidden
    />
  );

  const smallSpinner = (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-rose-600"
      aria-hidden
    />
  );

  if (variant === "inline") {
    return (
      <span
        role="status"
        aria-live="polite"
        className={`inline-flex items-center gap-2 text-sm text-neutral-500 ${className}`}
      >
        {smallSpinner}
        {label ? <span>{label}</span> : <span className="sr-only">Loading</span>}
      </span>
    );
  }

  if (variant === "overlay") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-[2px] ${className}`}
      >
        {spinner}
        {label && (
          <p className="text-sm font-medium tracking-wide text-neutral-600">
            {label}
          </p>
        )}
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`flex min-h-[60vh] flex-col items-center justify-center gap-4 ${className}`}
      >
        <span className="relative flex h-12 w-12 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/20" />
          <span className="relative h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-rose-600" />
        </span>
        <p className="text-sm font-medium tracking-wide text-neutral-500">
          {label || "Loading…"}
        </p>
      </div>
    );
  }

  // section (default)
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 py-16 md:py-24 ${className}`}
    >
      {spinner}
      <p className="text-sm text-neutral-500">{label || "Loading…"}</p>
    </div>
  );
}