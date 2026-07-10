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

/**
 * Everything about *this* product that a transactional email needs. Pass it to
 * every template. Apps typically wrap `BaseEmail` in a small local component
 * that fills this in from their config, so individual templates stay terse.
 *
 * This is how the shared layout stays brand-neutral: the registry owns the
 * structure and cross-client rendering; you own the identity.
 */
export interface EmailBrand {
	/** Product name — footer wordmark, logo alt text, and template copy. */
	productName: string;
	/** Absolute product base URL, e.g. "https://example.com". Relative footer links resolve against it. */
	baseUrl: string;
	/** Absolute URL to a ~180×28 logo image. Falls back to the product name as a wordmark when unset. */
	logoUrl?: string;
	/** Primary CTA / accent colour. */
	brandColor?: string;
	/** Footer "Contact support" link (absolute, or relative to baseUrl). */
	supportUrl?: string;
	/** Footer "Privacy policy" link (absolute, or relative to baseUrl). */
	privacyUrl?: string;
	/** Footer "Terms of service" link (absolute, or relative to baseUrl). */
	termsUrl?: string;
}

/** Neutral placeholder identity so the layout renders before you customize it. */
export const defaultBrand: EmailBrand = {
	productName: "Acme",
	baseUrl: "https://example.com",
	brandColor: "#2563eb",
};

const resolveUrl = (href: string | undefined, baseUrl: string): string | undefined => {
	if (!href) return undefined;
	if (/^https?:\/\//.test(href)) return href;
	return `${baseUrl.replace(/\/+$/, "")}/${href.replace(/^\/+/, "")}`;
};

export interface BaseEmailProps {
	/** Product identity. Defaults to a neutral placeholder — override per app. */
	brand?: EmailBrand;
	/** Inbox preview / preheader text. */
	preview: string;
	/**
	 * Public URL where this exact email can be viewed in a browser. When set,
	 * renders a small "View this email in your browser" link above the logo.
	 */
	viewInBrowserUrl?: string;
	children: ReactNode;
}

export function BaseEmail({
	brand = defaultBrand,
	preview,
	viewInBrowserUrl,
	children,
}: BaseEmailProps) {
	const supportUrl = resolveUrl(brand.supportUrl, brand.baseUrl);
	const privacyUrl = resolveUrl(brand.privacyUrl, brand.baseUrl);
	const termsUrl = resolveUrl(brand.termsUrl, brand.baseUrl);
	const footerLinks = [
		supportUrl ? { label: "Contact support", href: supportUrl } : null,
		privacyUrl ? { label: "Privacy policy", href: privacyUrl } : null,
		termsUrl ? { label: "Terms of service", href: termsUrl } : null,
	].filter((link): link is { label: string; href: string } => link !== null);

	return (
		<Html>
			<Head />
			<Preview>{preview}</Preview>
			<Body style={styles.main}>
				<Container style={styles.container}>
					{viewInBrowserUrl ? (
						<Section style={styles.viewInBrowserSection}>
							<Link
								href={viewInBrowserUrl}
								style={styles.viewInBrowserLink}
							>
								View this email in your browser
							</Link>
						</Section>
					) : null}

					<Section style={styles.headerSection}>
						<Link href={brand.baseUrl}>
							{brand.logoUrl ? (
								<Img
									src={brand.logoUrl}
									height="28"
									alt={brand.productName}
									style={styles.logo}
								/>
							) : (
								<Text style={styles.wordmark}>{brand.productName}</Text>
							)}
						</Link>
					</Section>

					<Section style={styles.contentSection}>{children}</Section>

					<Section style={styles.footerSection}>
						<Text style={styles.footerText}>
							&copy; {new Date().getFullYear()} {brand.productName}. All
							rights reserved.
							{footerLinks.length > 0 ? <br /> : null}
							{footerLinks.map((link, i) => (
								<span key={link.href}>
									{i > 0 ? " · " : null}
									<Link href={link.href} style={styles.footerLink}>
										{link.label}
									</Link>
								</span>
							))}
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

export interface EmailButtonProps {
	href: string;
	/** Background colour. Defaults to the neutral brand accent. */
	color?: string;
	children: ReactNode;
}

export function EmailButton({ href, color, children }: EmailButtonProps) {
	return (
		<Section style={styles.buttonSection}>
			<Button style={buttonStyle(color ?? defaultBrand.brandColor)} href={href}>
				{children}
			</Button>
		</Section>
	);
}

const buttonStyle = (backgroundColor: string | undefined): CSSProperties => ({
	lineHeight: "100%",
	textDecoration: "none",
	display: "inline-block",
	maxWidth: "100%",
	backgroundColor: backgroundColor ?? "#2563eb",
	borderRadius: "8px",
	color: "#ffffff",
	fontSize: "16px",
	fontWeight: "600",
	textAlign: "center",
	padding: "16px 32px",
	border: "none",
	cursor: "pointer",
});

export const styles = {
	main: {
		backgroundColor: "#f6f9fc",
		fontFamily:
			'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
	} as CSSProperties,
	container: {
		maxWidth: "600px",
		backgroundColor: "#ffffff",
		margin: "0 auto",
		padding: "20px 0 48px",
		marginBottom: "64px",
	} as CSSProperties,
	viewInBrowserSection: {
		padding: "12px 40px 0",
		textAlign: "center",
	} as CSSProperties,
	viewInBrowserLink: {
		color: "#9ca3af",
		fontSize: "11px",
		textDecoration: "underline",
	} as CSSProperties,
	headerSection: {
		padding: "32px 40px",
		textAlign: "center",
		backgroundColor: "#ffffff",
	} as CSSProperties,
	logo: {
		display: "block",
		outline: "none",
		border: "none",
		textDecoration: "none",
		margin: "0 auto",
	} as CSSProperties,
	wordmark: {
		fontSize: "22px",
		fontWeight: "700",
		color: "#1a1a1a",
		margin: "0",
		textAlign: "center",
	} as CSSProperties,
	contentSection: {
		padding: "0 40px",
	} as CSSProperties,
	heading: {
		color: "#1a1a1a",
		fontSize: "28px",
		fontWeight: "700",
		lineHeight: "1.3",
		margin: "0 0 30px",
		textAlign: "center",
	} as CSSProperties,
	paragraph: {
		fontSize: "16px",
		lineHeight: "1.6",
		color: "#374151",
		margin: "0 0 20px",
	} as CSSProperties,
	muted: {
		fontSize: "14px",
		lineHeight: "1.6",
		color: "#6b7280",
		margin: "0 0 20px",
	} as CSSProperties,
	buttonSection: {
		textAlign: "center",
		margin: "32px 0",
	} as CSSProperties,
	footerSection: {
		padding: "20px 40px",
		borderTop: "1px solid #e5e7eb",
		backgroundColor: "#f9fafb",
	} as CSSProperties,
	footerText: {
		fontSize: "12px",
		lineHeight: "1.5",
		color: "#6b7280",
		margin: "0",
		textAlign: "center",
	} as CSSProperties,
	footerLink: {
		color: "#6b7280",
		textDecoration: "underline",
	} as CSSProperties,
};
