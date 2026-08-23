import Link from "next/link";
import type { ReactNode } from "react";

export interface SiteFooterLink {
	label: string;
	href: string;
}

export interface SiteFooterSocial extends SiteFooterLink {
	/** A 16px glyph; rendered inside the hairline chip. */
	icon: ReactNode;
}

export interface SiteFooterProps {
	/** The logo mark; wrapped in a link to `homeHref`. */
	logo: ReactNode;
	homeHref?: string;
	/** One or two sentences under the logo. */
	blurb: ReactNode;
	/** Name in the © line. */
	orgName: string;
	/** The short line at the bottom-left, e.g. a motto. */
	tagline?: ReactNode;
	/** "Connect" column: external profiles and the contact address. */
	social?: SiteFooterSocial[];
	/** Bottom row of small links (About, Privacy, …). */
	links?: SiteFooterLink[];
	/** Heading over the social column. */
	socialHeading?: string;
}

/**
 * The marketing-site footer: logo + blurb on the left, a "Connect" column on
 * the right, a hairline, then the motto and the small-print links. Content
 * is data; the chrome is shared across the family of sites.
 */
export function SiteFooter({
	logo,
	homeHref = "/",
	blurb,
	orgName,
	tagline,
	social = [],
	links = [],
	socialHeading = "Connect",
}: SiteFooterProps) {
	return (
		<footer className="relative bg-background">
			<div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

			<div className="container mx-auto px-8 py-16 md:px-16">
				<div className="grid items-start gap-12 lg:grid-cols-3">
					<div className="space-y-6 lg:col-span-2">
						<Link href={homeHref} className="inline-block">
							{logo}
						</Link>

						<div className="max-w-2xl">
							<div className="mb-4 text-sm leading-relaxed text-muted-foreground">
								{blurb}
							</div>
							<p className="font-mono text-xs tracking-wide text-muted-foreground/60">
								© {new Date().getFullYear()} {orgName}
							</p>
						</div>
					</div>

					{social.length > 0 && (
						<div className="flex flex-col items-end space-y-4">
							<div className="flex flex-col items-start">
								<h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground/80">
									{socialHeading}
								</h3>

								<div className="flex flex-col space-y-3">
									{social.map((item) => {
										const external = /^https?:/.test(item.href);
										return (
											<Link
												key={item.href}
												href={item.href}
												{...(external && {
													target: "_blank",
													rel: "noopener noreferrer",
												})}
												className="group inline-flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
											>
												<div className="rounded-lg border border-border/30 p-1.5 transition-colors group-hover:border-primary/30">
													{item.icon}
												</div>
												<span className="text-sm font-medium">
													{item.label}
												</span>
											</Link>
										);
									})}
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="mt-16 border-t border-border/10 pt-8">
					<div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
						<p className="font-mono text-xs text-muted-foreground/60">
							{tagline}
						</p>
						<div className="flex flex-wrap items-center gap-4">
							{links.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
								>
									{item.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
