"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * The brand's signature motif: a faint 60px grid, four coral accent rules that
 * draw in on load, and four corner registration dots that pulse. Absolutely
 * positioned — place it inside a `relative` section, behind the content.
 *
 * The drawn state is the resting state: reduced motion and no-JS both leave
 * the rules fully visible (see the `.grid-line` rules in brand.css).
 */
export function BlueprintField({
	className,
	/** Lower the whole field for sections where it is connective tissue, not the hero. */
	opacity = 1,
}: {
	className?: string;
	opacity?: number;
}) {
	const ref = useRef<SVGSVGElement>(null);
	const id = "blueprint-grid";

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const lines = ref.current?.querySelectorAll<SVGLineElement>(".grid-line") ?? [];
		const timers = Array.from(lines, (line, index) =>
			setTimeout(() => {
				line.style.strokeDasharray = "0 100";
				line.style.animation = "draw-line 2s ease-out forwards";
			}, index * 500),
		);
		return () => timers.forEach(clearTimeout);
	}, []);

	return (
		<svg
			ref={ref}
			aria-hidden="true"
			className={cn(
				"pointer-events-none absolute inset-0 h-full w-full",
				className,
			)}
			style={{ opacity }}
			xmlns="http://www.w3.org/2000/svg"
		>
			<noscript>
				<style>{`.grid-line{opacity:.8!important;stroke-dasharray:100 0!important}`}</style>
			</noscript>
			<defs>
				<pattern id={id} width="60" height="60" patternUnits="userSpaceOnUse">
					<path
						d="M 60 0 L 0 0 0 60"
						fill="none"
						stroke="var(--border)"
						strokeOpacity="0.35"
						strokeWidth="0.5"
					/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${id})`} />

			{[
				{ x1: "0", y1: "20%", x2: "100%", y2: "20%", o: 0.2, w: 1 },
				{ x1: "0", y1: "80%", x2: "100%", y2: "80%", o: 0.2, w: 1 },
				{ x1: "20%", y1: "0", x2: "20%", y2: "100%", o: 0.15, w: 0.5 },
				{ x1: "80%", y1: "0", x2: "80%", y2: "100%", o: 0.15, w: 0.5 },
			].map((l, i) => (
				<line
					key={i}
					{...{ x1: l.x1, y1: l.y1, x2: l.x2, y2: l.y2 }}
					className="grid-line"
					stroke="var(--primary)"
					strokeOpacity={l.o}
					strokeWidth={l.w}
				/>
			))}

			{[
				["20%", "20%"],
				["80%", "20%"],
				["20%", "80%"],
				["80%", "80%"],
			].map(([cx, cy], i) => (
				<circle
					key={i}
					cx={cx}
					cy={cy}
					r="2"
					fill="var(--primary)"
					fillOpacity="0.4"
					className="animate-pulse"
					style={{ animationDelay: `${3 + i * 0.2}s` }}
				/>
			))}
		</svg>
	);
}
