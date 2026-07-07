import { cn } from "@/lib/utils";

/**
 * Maps entity statuses to one consistent color language across a dashboard.
 * Deliberately a styled span rather than the brand Badge: these carry semantic
 * state colors (success/failure/pending/active), not the brand palette.
 */

export type StatusTone = "green" | "red" | "amber" | "blue" | "gray";

const TONES: Record<StatusTone, string> = {
	green: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
	red: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
	amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
	blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
	gray: "bg-muted text-muted-foreground border-border",
};

function toneFor(status: string): StatusTone {
	const s = status.toLowerCase();
	if (
		s === "completed" ||
		s === "approved" ||
		s === "active" ||
		s === "succeeded" ||
		s === "verified" ||
		s === "healthy"
	) {
		return "green";
	}
	if (
		s === "failed" ||
		s === "rejected" ||
		s === "error" ||
		s === "expired" ||
		s === "canceled" ||
		s === "cancelled"
	) {
		return "red";
	}
	if (s.startsWith("paused") || s === "pending" || s === "waiting") return "amber";
	if (s === "running" || s === "queued" || s === "in_progress") return "blue";
	return "gray";
}

export function StatusBadge({
	status,
	tone,
	className,
}: {
	status: string | null | undefined;
	/** Override the inferred tone when the default mapping is wrong for a domain. */
	tone?: StatusTone;
	className?: string;
}) {
	const label = status ?? "unknown";
	return (
		<span
			data-slot="status-badge"
			className={cn(
				"inline-flex w-fit items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
				TONES[tone ?? toneFor(label)],
				className,
			)}
		>
			{label.replaceAll("_", " ")}
		</span>
	);
}
