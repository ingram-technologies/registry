import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Compact metric tile: icon + label + big value, with an optional sublabel. */
export function StatCard({
	icon: Icon,
	label,
	value,
	sublabel,
	className,
}: {
	icon: LucideIcon;
	label: string;
	value: string;
	sublabel?: string;
	className?: string;
}) {
	return (
		<Card data-slot="stat-card" className={cn("gap-2 p-4", className)}>
			<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
				<Icon className="size-3.5" /> {label}
			</div>
			<div className="text-2xl font-semibold tabular-nums">{value}</div>
			{sublabel ? (
				<div className="text-muted-foreground text-xs">{sublabel}</div>
			) : null}
		</Card>
	);
}

/** Shared number formatter for compact stat displays (1.2k, 3.4M). */
export function compactNumber(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
	return `${n}`;
}
