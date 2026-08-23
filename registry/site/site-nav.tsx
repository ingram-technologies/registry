"use client";

import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

import { NavDropdown, type NavDropdownItem } from "@/components/nav-dropdown";

/**
 * One entry in the top bar: a plain link, or a dropdown (with an optional
 * destination of its own — taps navigate, hover opens the panel).
 */
export type SiteNavSection =
	| { label: string; href: string; items?: undefined }
	| {
			label: string;
			href?: string;
			items: NavDropdownItem[];
			/** Columns in the desktop panel */
			columns?: 1 | 2;
			/** Which edge of the trigger the panel aligns to */
			align?: "left" | "right";
			/** Tailwind width class for the panel, e.g. "w-[560px]" */
			widthClassName?: string;
	  };

export interface SiteNavProps {
	/** The logo mark (an <Image>, an <svg>, …); wrapped in a link to `homeHref`. */
	logo: ReactNode;
	homeHref?: string;
	sections: SiteNavSection[];
	/** Desktop call-to-action at the right end of the pill (e.g. a `.btn-cta`). */
	cta?: ReactNode;
	/**
	 * Extra rows at the bottom of the mobile sheet (a contact button, the CTA).
	 * Receives a `close` callback to collapse the sheet after an action.
	 */
	mobileFooter?: (close: () => void) => ReactNode;
	/** Accessible name for the logo link. */
	siteName?: string;
}

/**
 * The marketing-site navigation: a floating glass pill on desktop, a
 * fixed glass bar with a collapsible sheet on mobile. All content is data —
 * the site passes its logo, sections and CTA; the chrome is shared.
 */
export function SiteNav({
	logo,
	homeHref = "/",
	sections,
	cta,
	mobileFooter,
	siteName,
}: SiteNavProps) {
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const [openSection, setOpenSection] = useState<string | null>(null);

	const closeMobile = () => {
		setIsMobileOpen(false);
		setOpenSection(null);
	};

	return (
		<>
			{/* Desktop: floating pill */}
			<div className="fixed top-8 left-1/2 z-50 hidden w-fit min-w-max -translate-x-1/2 lg:block">
				<nav className="relative isolate" aria-label="Main">
					<div className="absolute inset-0 rounded-full border border-border/10 bg-card/20 backdrop-blur-xl" />
					<div className="relative px-6 py-4">
						<div className="flex items-center justify-between space-x-10">
							<Link
								href={homeHref}
								className="flex flex-shrink-0 items-center"
								aria-label={siteName}
							>
								{logo}
							</Link>

							<div className="flex items-center space-x-6 text-sm text-muted-foreground/80">
								{sections.map((section) =>
									section.items ? (
										<NavDropdown
											key={section.label}
											label={section.label}
											href={section.href}
											items={section.items}
											columns={section.columns}
											align={section.align}
											widthClassName={section.widthClassName}
										/>
									) : (
										<Link
											key={section.label}
											href={section.href}
											className="font-medium tracking-wide transition-all duration-300 hover:text-foreground"
										>
											{section.label}
										</Link>
									),
								)}
							</div>

							{cta}
						</div>
					</div>
				</nav>
			</div>

			{/* Mobile: fixed glass bar + sheet */}
			<nav
				className="glass-nav fixed top-0 right-0 left-0 z-50 lg:hidden"
				aria-label="Main"
			>
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<Link
							href={homeHref}
							className="flex flex-shrink-0 items-center"
							aria-label={siteName}
						>
							{logo}
						</Link>

						<button
							type="button"
							onClick={() => setIsMobileOpen(!isMobileOpen)}
							aria-label={
								isMobileOpen
									? "Close navigation menu"
									: "Open navigation menu"
							}
							aria-expanded={isMobileOpen}
							className="p-2 text-foreground transition-colors hover:text-primary"
						>
							{isMobileOpen ? (
								<XIcon className="h-6 w-6" aria-hidden="true" />
							) : (
								<MenuIcon className="h-6 w-6" aria-hidden="true" />
							)}
						</button>
					</div>

					{isMobileOpen && (
						<div className="glass-card mt-2 space-y-1 px-2 pt-2 pb-3 sm:px-3">
							{sections.map((section, index) =>
								section.items ? (
									<MobileGroup
										key={section.label}
										label={section.label}
										href={section.href}
										items={section.items}
										isOpen={openSection === section.label}
										onToggle={() =>
											setOpenSection(
												openSection === section.label
													? null
													: section.label,
											)
										}
										onNavigate={closeMobile}
										className={
											index === 0 ? "mt-0 border-none pt-0" : ""
										}
									/>
								) : (
									<Link
										key={section.label}
										href={section.href}
										className="block px-3 py-2 text-foreground transition-colors hover:text-primary"
										onClick={closeMobile}
									>
										{section.label}
									</Link>
								),
							)}
							{mobileFooter?.(closeMobile)}
						</div>
					)}
				</div>
			</nav>
		</>
	);
}

function MobileBadge({ children }: { children: ReactNode }) {
	return (
		<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
			{children}
		</span>
	);
}

/** A single dropdown entry on mobile: a link, a labelled subsection, or a non-clickable item. */
function MobileItem({
	item,
	onNavigate,
}: {
	item: NavDropdownItem;
	onNavigate: () => void;
}) {
	// An entry with a submenu: render the link like the others, then nest its
	// sub-items beneath it.
	if (item.href && item.items) {
		return (
			<div>
				<Link
					href={item.href}
					className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
					onClick={onNavigate}
				>
					<span>{item.title}</span>
					{item.badge && <MobileBadge>{item.badge}</MobileBadge>}
				</Link>
				<div className="ml-3 border-l border-border/10 pl-2">
					{item.items.map((child) => (
						<MobileItem
							key={child.href ?? child.title}
							item={child}
							onNavigate={onNavigate}
						/>
					))}
				</div>
			</div>
		);
	}

	if (item.items) {
		return (
			<div className="mt-1 pt-1">
				<div className="px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/50">
					{item.title}
				</div>
				{item.items.map((child) => (
					<MobileItem
						key={child.href ?? child.title}
						item={child}
						onNavigate={onNavigate}
					/>
				))}
			</div>
		);
	}

	if (item.href) {
		return (
			<Link
				href={item.href}
				className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
				onClick={onNavigate}
			>
				<span>{item.title}</span>
				{item.badge && <MobileBadge>{item.badge}</MobileBadge>}
			</Link>
		);
	}

	return (
		<div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground/50">
			<span>{item.title}</span>
			{item.badge && <MobileBadge>{item.badge}</MobileBadge>}
		</div>
	);
}

function MobileGroup({
	label,
	href,
	items,
	isOpen,
	onToggle,
	onNavigate,
	className = "",
}: {
	label: string;
	/** Optional destination for the label — taps navigate, the chevron still toggles the submenu */
	href?: string;
	items: NavDropdownItem[];
	isOpen: boolean;
	onToggle: () => void;
	onNavigate: () => void;
	className?: string;
}) {
	return (
		<div className={`mt-2 border-t border-border/10 pt-2 ${className}`}>
			{href ? (
				<div className="flex w-full items-center justify-between">
					<Link
						href={href}
						onClick={onNavigate}
						className="flex-1 px-3 py-2 text-foreground transition-colors hover:text-primary"
					>
						{label}
					</Link>
					<button
						type="button"
						onClick={onToggle}
						aria-label={`Toggle ${label} submenu`}
						aria-expanded={isOpen}
						className="px-3 py-2 text-foreground transition-colors hover:text-primary"
					>
						<ChevronDownIcon
							className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
						/>
					</button>
				</div>
			) : (
				<button
					type="button"
					onClick={onToggle}
					aria-expanded={isOpen}
					className="flex w-full items-center justify-between px-3 py-2 text-foreground transition-colors hover:text-primary"
				>
					<span>{label}</span>
					<ChevronDownIcon
						className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
					/>
				</button>
			)}
			{isOpen && (
				<div className="ml-4 space-y-1">
					{items.map((item) => (
						<MobileItem
							key={item.href ?? item.title}
							item={item}
							onNavigate={onNavigate}
						/>
					))}
				</div>
			)}
		</div>
	);
}
