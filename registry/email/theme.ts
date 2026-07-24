/**
 * The two halves of a transactional email's identity, kept apart on purpose.
 *
 * `EmailTheme` is pure presentation — colours, type, radius — and nothing in it
 * names a product. `EmailBrand` is *this* product: its name, its URLs, its
 * logo. One theme therefore dresses a whole fleet, and adding a product means
 * writing an `EmailBrand`, never a stylesheet.
 *
 * Templates never read these directly: they call `emailStyles(brand)` from
 * `base-email`, so no template can hard-code a colour.
 */

/** The subset of a theme that a dark-mode client may override. */
export interface EmailThemeDark {
	page?: string;
	surface?: string;
	masthead?: string;
	mastheadInk?: string;
	footer?: string;
	ink?: string;
	inkBody?: string;
	inkMuted?: string;
	line?: string;
	accent?: string;
	accentInk?: string;
	link?: string;
}

export interface EmailTheme {
	/** Page background, behind the sheet. */
	page: string;
	/** The sheet the message sits on. */
	surface: string;
	/** Masthead band. */
	masthead: string;
	/** Text on the masthead band. Clear 4.5:1 against `masthead`. */
	mastheadInk: string;
	/** Footer band. */
	footer: string;
	/** Headings. Clear 4.5:1 against `surface`. */
	ink: string;
	/** Body copy. Clear 4.5:1 against `surface`. */
	inkBody: string;
	/** Secondary copy. Clear 4.5:1 against both `surface` and `footer`. */
	inkMuted: string;
	/** The one hairline weight, between bands. */
	line: string;
	/** The signal: CTA fill and the rule above the masthead. Used sparingly. */
	accent: string;
	/** Text on `accent`. Clear 4.5:1 against it — check this when you retheme. */
	accentInk: string;
	/** Links in copy. Clear 4.5:1 against `surface`; usually a darker `accent`. */
	link: string;
	/** Corner radius on the sheet and the CTA. */
	radius: string;
	/** Body font stack. End it in a websafe family — most clients ignore webfonts. */
	fontFamily: string;
	/** Monospace stack for wire strings (URLs, ids, codes). */
	monoFamily: string;
	/** Overrides applied under `prefers-color-scheme: dark`. Omit to opt out. */
	dark?: EmailThemeDark;
}

/**
 * A restrained, product-agnostic default so the shell renders before anyone has
 * themed it. Neutral greys, one blue signal — deliberately unmemorable, because
 * the point is that you replace it.
 */
export const neutralTheme: EmailTheme = {
	page: "#F5F5F5",
	surface: "#FFFFFF",
	masthead: "#FFFFFF",
	mastheadInk: "#1C1C1C",
	footer: "#FAFAFA",
	ink: "#1C1C1C",
	inkBody: "#3D3D3D",
	inkMuted: "#5C5C5C",
	line: "#E5E5E5",
	accent: "#2563EB",
	accentInk: "#FFFFFF",
	link: "#1D4ED8",
	radius: "6px",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
	monoFamily:
		'ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace',
	dark: {
		page: "#141414",
		surface: "#1C1C1C",
		masthead: "#1C1C1C",
		mastheadInk: "#F5F5F5",
		footer: "#171717",
		ink: "#F5F5F5",
		inkBody: "#D4D4D4",
		inkMuted: "#A3A3A3",
		line: "#333333",
		link: "#93B4FF",
	},
};

/** Everything about *this* product that a transactional email needs. */
export interface EmailBrand {
	/** Product name — masthead wordmark, logo alt text, and template copy. */
	productName: string;
	/** Absolute product base URL. Relative footer links resolve against it. */
	baseUrl: string;
	/** Absolute URL to a ~20px-tall logo. Falls back to a text wordmark, which
	 *  is the safer default: images are blocked by default in many clients. */
	logoUrl?: string;
	/** Legal entity in the copyright line. Defaults to `productName`. */
	legalName?: string;
	/** Footer "Support" link (absolute, or relative to `baseUrl`). */
	supportUrl?: string;
	/** Footer "Privacy" link (absolute, or relative to `baseUrl`). */
	privacyUrl?: string;
	/** Footer "Terms" link (absolute, or relative to `baseUrl`). */
	termsUrl?: string;
	/** Presentation. Defaults to {@link neutralTheme}. */
	theme?: EmailTheme;
}

/** Placeholder identity so the shell renders before you customize it. */
export const neutralBrand: EmailBrand = {
	productName: "Acme",
	baseUrl: "https://example.com",
};
