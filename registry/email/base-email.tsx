import {
	Body,
	Button,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from "react-email";
import type { CSSProperties, ReactNode } from "react";
import { neutralBrand, neutralTheme } from "./theme";
import type { EmailBrand, EmailTheme } from "./theme";

export type { EmailBrand, EmailTheme } from "./theme";
export { neutralBrand, neutralTheme } from "./theme";

/**
 * The shell every template renders into: an accent rule, a masthead, the
 * message, a footer — four bands stacked edge to edge on one sheet, separated
 * by a single hairline weight rather than floating in a padded canvas.
 *
 * Presentation comes entirely from `brand.theme`, so this file holds no colours
 * of its own and reskinning a product is a data change. Copy is left-aligned:
 * centred 28px headings are the generic-SaaS email tell, and left-aligned copy
 * is faster to scan on a phone.
 */

const resolveTheme = (brand: EmailBrand): EmailTheme => brand.theme ?? neutralTheme;

const resolveUrl = (href: string | undefined, baseUrl: string): string | undefined => {
	if (!href) return undefined;
	if (/^https?:\/\//.test(href)) return href;
	return `${baseUrl.replace(/\/+$/, "")}/${href.replace(/^\/+/, "")}`;
};

/**
 * The dark-mode and small-screen rules — the only CSS that can't be inlined.
 * Clients that strip `<style>` keep the light, full-padding rendering, which is
 * why every value here overrides something that is already inline.
 */
function overrideCss(theme: EmailTheme): string {
	const d = theme.dark;
	const rule = (selector: string, prop: string, value: string | undefined) =>
		value ? `${selector}{${prop}:${value} !important}` : "";
	const dark = d
		? `@media (prefers-color-scheme:dark){` +
			rule(".em-page", "background-color", d.page) +
			rule(".em-surface", "background-color", d.surface) +
			rule(".em-masthead", "background-color", d.masthead) +
			rule(".em-masthead-ink", "color", d.mastheadInk) +
			rule(".em-footer", "background-color", d.footer) +
			rule(".em-ink", "color", d.ink) +
			rule(".em-ink-body", "color", d.inkBody) +
			rule(".em-ink-muted", "color", d.inkMuted) +
			rule(".em-line", "border-color", d.line) +
			rule(".em-cta", "background-color", d.accent) +
			rule(".em-cta", "color", d.accentInk) +
			rule(".em-link", "color", d.link) +
			`}`
		: "";
	return (
		`@media (max-width:600px){.em-pad{padding-left:20px !important;` +
		`padding-right:20px !important}}${dark}`
	);
}

export interface BaseEmailProps {
	/** Product identity. Defaults to a neutral placeholder — override per app. */
	brand?: EmailBrand;
	/** Inbox preview / preheader text. */
	preview: string;
	/**
	 * Public URL where this exact email can be viewed in a browser. When set,
	 * renders a quiet "View in browser" link above the sheet.
	 */
	viewInBrowserUrl?: string;
	children: ReactNode;
}

export function BaseEmail({
	brand = neutralBrand,
	preview,
	viewInBrowserUrl,
	children,
}: BaseEmailProps) {
	const s = emailStyles(brand);
	const links = [
		{ label: "Support", href: resolveUrl(brand.supportUrl, brand.baseUrl) },
		{ label: "Privacy", href: resolveUrl(brand.privacyUrl, brand.baseUrl) },
		{ label: "Terms", href: resolveUrl(brand.termsUrl, brand.baseUrl) },
	].filter((link): link is { label: string; href: string } => Boolean(link.href));

	return (
		<Html lang="en" dir="ltr">
			<Head>
				<meta name="color-scheme" content="light dark" />
				<meta name="supported-color-schemes" content="light dark" />
				<style>{overrideCss(resolveTheme(brand))}</style>
			</Head>
			<Preview>{preview}</Preview>
			<Body {...s.page}>
				<Section {...s.pageBand}>
					{viewInBrowserUrl ? (
						<Section {...s.viewInBrowser}>
							<Link href={viewInBrowserUrl} {...s.viewInBrowserLink}>
								View in browser
							</Link>
						</Section>
					) : null}

					<Container {...s.sheet}>
						<Section {...s.accentRule}>
							<Text {...s.accentRuleFill}>&nbsp;</Text>
						</Section>

						<Section {...s.masthead}>
							<Link href={brand.baseUrl} {...s.mastheadLink}>
								{brand.logoUrl ? (
									<Img
										src={brand.logoUrl}
										height="20"
										alt={brand.productName}
										{...s.logo}
									/>
								) : (
									<span {...s.wordmark}>{brand.productName}</span>
								)}
							</Link>
						</Section>

						<Section {...s.content}>{children}</Section>

						<Section {...s.footer}>
							{links.length > 0 ? (
								<Text {...s.footerLinks}>
									{links.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											{...s.footerLink}
										>
											{link.label}
										</Link>
									))}
								</Text>
							) : null}
							<Text {...s.legal}>
								&copy; {new Date().getFullYear()}{" "}
								{brand.legalName ?? brand.productName}
							</Text>
						</Section>
					</Container>
				</Section>
			</Body>
		</Html>
	);
}

export interface EmailButtonProps {
	/** Product identity — supplies the accent the button is filled with. */
	brand?: EmailBrand;
	href: string;
	children: ReactNode;
}

/** The one call to action. A message gets a single primary button, or none. */
export function EmailButton({
	brand = neutralBrand,
	href,
	children,
}: EmailButtonProps) {
	const s = emailStyles(brand);
	return (
		<Section {...s.ctaSection}>
			<Button {...s.cta} href={href}>
				{children}
			</Button>
		</Section>
	);
}

export interface WireLinkProps {
	/** Product identity — supplies the mono stack and link colour. */
	brand?: EmailBrand;
	/** The same URL the button points at, for clients that strip buttons. */
	url: string;
	/** Leading line. Defaults to English. */
	label?: ReactNode;
}

/**
 * The button's URL in plain sight, set in mono because it's a wire string —
 * something a machine emitted verbatim, not prose. Every template with a CTA
 * ends in one of these, so the fallback path is identical everywhere.
 */
export function WireLink({ brand = neutralBrand, url, label }: WireLinkProps) {
	const s = emailStyles(brand);
	return (
		<Section {...s.wireSection}>
			<Text {...s.wireLabel}>
				{label ?? "Or paste this link into your browser:"}
			</Text>
			<Link href={url} {...s.wireUrl}>
				{url}
			</Link>
		</Section>
	);
}

/** A style plus the class that re-colours it in dark mode. Spread it, don't
 *  pick it apart — `<Heading {...s.heading}>` is how the two stay together. */
interface EmailStyle {
	style: CSSProperties;
	className?: string;
}

const styled = (style: CSSProperties, className?: string): EmailStyle => ({
	style,
	className,
});

/**
 * Every style a template can need, resolved against the brand's theme. Ask for
 * these rather than writing a style object in a template — that is what keeps a
 * colour from being hard-coded into one message and drifting from the rest.
 *
 * Each entry carries its own dark-mode class, so it is spread onto the element:
 * an inline colour with no class is invisible the moment a client honours
 * `prefers-color-scheme`, and that failure is silent in every light-mode test.
 */
export function emailStyles(brand: EmailBrand = neutralBrand) {
	const t = resolveTheme(brand);
	return {
		// React Email's <Body> keeps only the background — it forces margin and
		// padding to 0 and drops font-family — and Outlook ignores a <body>
		// background outright. So the area around the sheet is painted by a real
		// band, and every text style below names its own font stack rather than
		// inheriting one.
		page: styled({ backgroundColor: t.page }, "em-page"),
		pageBand: styled(
			{ backgroundColor: t.page, padding: "24px 12px 40px", width: "100%" },
			"em-page",
		),
		viewInBrowser: styled({
			maxWidth: "600px",
			margin: "0 auto 12px",
			textAlign: "center",
		}),
		viewInBrowserLink: styled(
			{ color: t.inkMuted, fontSize: "12px", textDecoration: "underline" },
			"em-ink-muted",
		),
		sheet: styled(
			{
				maxWidth: "600px",
				width: "100%",
				backgroundColor: t.surface,
				borderRadius: t.radius,
				margin: "0 auto",
				overflow: "hidden",
			},
			"em-surface",
		),
		accentRule: styled({ backgroundColor: t.accent }),
		accentRuleFill: styled({ margin: "0", fontSize: "1px", lineHeight: "3px" }),
		masthead: styled(
			{ backgroundColor: t.masthead, padding: "18px 32px" },
			"em-masthead",
		),
		// Colour it, or React Email's default link blue rides in on the anchor.
		mastheadLink: styled(
			{ color: t.mastheadInk, textDecoration: "none" },
			"em-masthead-ink",
		),
		logo: styled({ display: "block", border: "none", outline: "none" }),
		wordmark: styled(
			{
				color: t.mastheadInk,
				fontFamily: t.fontFamily,
				fontSize: "15px",
				fontWeight: "600",
				letterSpacing: "-0.01em",
				textDecoration: "none",
			},
			"em-masthead-ink",
		),
		content: styled({ padding: "32px" }, "em-pad"),

		/** The message's one h1. Sentence case, left-aligned, never centred. */
		heading: styled(
			{
				color: t.ink,
				fontFamily: t.fontFamily,
				fontSize: "22px",
				fontWeight: "600",
				lineHeight: "1.35",
				letterSpacing: "-0.015em",
				margin: "0 0 16px",
			},
			"em-ink",
		),
		paragraph: styled(
			{
				color: t.inkBody,
				fontFamily: t.fontFamily,
				fontSize: "16px",
				lineHeight: "1.6",
				margin: "0 0 16px",
			},
			"em-ink-body",
		),
		/** Secondary copy: expiry notes, "if you didn't request this" lines. */
		muted: styled(
			{
				color: t.inkMuted,
				fontFamily: t.fontFamily,
				fontSize: "13px",
				lineHeight: "1.6",
				margin: "0 0 8px",
			},
			"em-ink-muted",
		),
		/** Inline link inside body copy. */
		link: styled({ color: t.link, textDecoration: "underline" }, "em-link"),

		ctaSection: styled({ margin: "24px 0" }),
		cta: styled(
			{
				backgroundColor: t.accent,
				color: t.accentInk,
				borderRadius: t.radius,
				display: "inline-block",
				fontFamily: t.fontFamily,
				fontSize: "15px",
				fontWeight: "600",
				lineHeight: "100%",
				padding: "13px 24px",
				textDecoration: "none",
			},
			"em-cta",
		),

		wireSection: styled(
			{
				borderTop: `1px solid ${t.line}`,
				margin: "24px 0 0",
				padding: "16px 0 0",
			},
			"em-line",
		),
		wireLabel: styled(
			{
				color: t.inkMuted,
				fontFamily: t.fontFamily,
				fontSize: "13px",
				lineHeight: "1.6",
				margin: "0 0 4px",
			},
			"em-ink-muted",
		),
		wireUrl: styled(
			{
				color: t.link,
				fontFamily: t.monoFamily,
				fontSize: "13px",
				lineHeight: "1.5",
				wordBreak: "break-all",
			},
			"em-link",
		),

		footer: styled(
			{
				backgroundColor: t.footer,
				borderTop: `1px solid ${t.line}`,
				padding: "20px 32px",
			},
			"em-footer em-line em-pad",
		),
		footerLinks: styled({ margin: "0 0 8px" }),
		footerLink: styled(
			{
				color: t.inkMuted,
				fontFamily: t.fontFamily,
				fontSize: "13px",
				paddingRight: "20px",
				textDecoration: "none",
			},
			"em-ink-muted",
		),
		legal: styled(
			{
				color: t.inkMuted,
				fontFamily: t.fontFamily,
				fontSize: "12px",
				lineHeight: "1.5",
				margin: "0",
			},
			"em-ink-muted",
		),
	};
}
