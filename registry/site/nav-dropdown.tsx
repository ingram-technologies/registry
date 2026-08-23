"use client";

import { ChevronRightIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import React from "react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export interface NavDropdownItem {
	title: string;
	/** Optional destination. Items without an href render as non-clickable. */
	href?: string;
	description: string;
	/** Optional short tag, e.g. "Soon" or "New" */
	badge?: string;
	/** Optional sub-items, rendered as a labelled subsection (e.g. "Ingram Labs") */
	items?: NavDropdownItem[];
}

interface NavDropdownProps {
	label: string;
	/** Optional destination for the label itself — makes the trigger clickable while still opening on hover */
	href?: Route;
	items: NavDropdownItem[];
	/** Number of columns in the panel grid on desktop */
	columns?: 1 | 2;
	/** Which edge of the trigger the panel aligns to */
	align?: "left" | "right";
	/** Tailwind width class for the panel, e.g. "w-[560px]" */
	widthClassName?: string;
}

function ItemBadge({ children }: { children: React.ReactNode }) {
	return (
		<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
			{children}
		</span>
	);
}

function ItemBody({ item }: { item: NavDropdownItem }) {
	return (
		<>
			<div className="flex items-center gap-2">
				<span className="text-sm font-semibold leading-none">{item.title}</span>
				{item.badge && <ItemBadge>{item.badge}</ItemBadge>}
			</div>
			<p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
				{item.description}
			</p>
		</>
	);
}

const ListItem = React.forwardRef<
	React.ComponentRef<"a">,
	React.ComponentPropsWithoutRef<"a"> & { item: NavDropdownItem & { href: string } }
>(({ className, item, ...props }, ref) => {
	return (
		<NavigationMenuLink
			render={
				<Link
					ref={ref}
					href={item.href}
					className={cn(
						"group block select-none space-y-1 px-4 py-2.5 leading-none no-underline outline-none transition-colors hover:bg-accent/50",
						className,
					)}
					{...props}
				>
					<ItemBody item={item} />
				</Link>
			}
		/>
	);
});
ListItem.displayName = "NavDropdownItem";

/** A non-clickable entry (no href), e.g. a product that isn't live yet. */
function StaticItem({ item }: { item: NavDropdownItem }) {
	return (
		<div className="block cursor-default select-none space-y-1 px-4 py-2.5 leading-none opacity-60">
			<ItemBody item={item} />
		</div>
	);
}

/** A labelled subsection within a dropdown, e.g. "Ingram Labs". The label
 * links to its own page when the group carries an href. */
function GroupSection({ item }: { item: NavDropdownItem }) {
	const label = (
		<span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/60">
			{item.title}
		</span>
	);
	return (
		<div className="col-span-full mt-1 border-t border-border/10 pt-2">
			<div className="px-4 pb-1">
				{item.href ? (
					<NavigationMenuLink
						render={
							<Link
								href={item.href}
								className="transition-colors hover:text-foreground"
							>
								{label}
							</Link>
						}
					/>
				) : (
					label
				)}
			</div>
			{item.items?.map((child) => renderItem(child))}
		</div>
	);
}

/** A product row shown like the others. Hovering it reveals a flyout submenu
 * to the side — e.g. "Ingram Labs" popping out the ventures. */
function ProductWithSubmenu({
	item,
}: {
	item: NavDropdownItem & { href: string; items: NavDropdownItem[] };
}) {
	return (
		<div className="group/fly relative">
			<div className="relative">
				<ListItem item={{ ...item, href: item.href }} />
				<ChevronRightIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 transition-colors group-hover/fly:text-foreground" />
			</div>

			{/* Flyout — a child of the hovered row (so hovering it keeps it open),
			    with transparent left padding as a bridge across the gap. */}
			<div className="invisible absolute top-0 left-full z-50 pl-1.5 opacity-0 transition-opacity duration-150 group-hover/fly:visible group-hover/fly:opacity-100">
				<div className="w-64 rounded-lg border border-border/10 bg-card/95 py-2 shadow-xl backdrop-blur-2xl">
					{item.items.map((child) =>
						child.href ? (
							<NavigationMenuLink
								key={child.href}
								render={
									<Link
										href={child.href}
										className="block select-none px-4 py-2 no-underline outline-none transition-colors hover:bg-accent/50"
									>
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium leading-none text-foreground">
												{child.title}
											</span>
											{child.badge && (
												<ItemBadge>{child.badge}</ItemBadge>
											)}
										</div>
										<p className="mt-1 line-clamp-1 text-xs leading-snug text-muted-foreground">
											{child.description}
										</p>
									</Link>
								}
							/>
						) : (
							<StaticItem key={child.title} item={child} />
						),
					)}
				</div>
			</div>
		</div>
	);
}

function renderItem(item: NavDropdownItem) {
	if (item.href && item.items) {
		return (
			<ProductWithSubmenu
				key={item.href}
				item={{ ...item, href: item.href, items: item.items }}
			/>
		);
	}
	if (item.items) {
		return <GroupSection key={item.title} item={item} />;
	}
	if (item.href) {
		return <ListItem key={item.href} item={{ ...item, href: item.href }} />;
	}
	return <StaticItem key={item.title} item={item} />;
}

export function NavDropdown({
	label,
	href,
	items,
	columns = 1,
	align = "left",
	widthClassName,
}: NavDropdownProps) {
	const triggerClassName =
		"h-auto bg-transparent px-3 py-2 text-sm font-medium tracking-wide text-muted-foreground/80 hover:bg-transparent hover:text-foreground focus:bg-transparent data-popup-open:bg-transparent data-popup-open:text-foreground";

	// A flyout submenu must escape the content's default overflow-hidden clip.
	const hasFlyout = items.some((item) => item.href && item.items);

	return (
		<NavigationMenu align={align === "right" ? "end" : "start"}>
			<NavigationMenuList>
				<NavigationMenuItem>
					{href ? (
						<NavigationMenuTrigger
							className={triggerClassName}
							render={
								<Link
									href={href}
									className="inline-flex items-center"
								/>
							}
						>
							{label}
						</NavigationMenuTrigger>
					) : (
						<NavigationMenuTrigger className={triggerClassName}>
							{label}
						</NavigationMenuTrigger>
					)}
					<NavigationMenuContent
						className={cn(
							"rounded-lg border border-border/10 bg-card/40 shadow-xl backdrop-blur-2xl",
							hasFlyout ? "overflow-visible!" : "overflow-hidden",
						)}
					>
						<div
							className={cn(
								"max-w-[calc(100vw-2rem)] py-2",
								widthClassName ?? "w-[320px]",
							)}
						>
							<div
								className={cn(
									"grid",
									columns === 2 && "sm:grid-cols-2",
								)}
							>
								{items.map((item) => renderItem(item))}
							</div>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
