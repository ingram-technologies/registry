import type { EmailBrand, EmailTheme } from "./theme";

/**
 * Ingram's house style for transactional email — the same identity the consoles
 * carry, at a quieter volume: chroma-0 neutrals, one coral signal, Inter for
 * prose and JetBrains Mono for anything a machine emitted verbatim.
 *
 * Colours are the sRGB renderings of the OKLCH brand tokens, because email has
 * no custom properties and no OKLCH support worth relying on. Every pair clears
 * WCAG AA:
 *
 * | pair                        | ratio |
 * | --------------------------- | ----- |
 * | `ink` on `surface`          | 17.0  |
 * | `inkBody` on `surface`      | 10.9  |
 * | `inkMuted` on `footer`      |  6.4  |
 * | `link` on `surface`         |  7.4  |
 * | `accentInk` on `accent`     |  6.3  |
 * | `mastheadInk` on `masthead` | 17.0  |
 *
 * Two of those are worth knowing about. Coral carries **near-black** text, not
 * white — white on coral is 3.1:1 and fails; this is what the console's primary
 * button already does. And `link` is the dark stop of the brand gradient
 * (`#A12A17`), because coral itself is 3.1:1 on white and can't be a link.
 */
export const ingramTheme: EmailTheme = {
	page: "#F5F5F5",
	surface: "#FFFFFF",
	masthead: "#1C1C1C",
	mastheadInk: "#FFFFFF",
	footer: "#FAFAFA",
	ink: "#1C1C1C",
	inkBody: "#3D3D3D",
	inkMuted: "#5C5C5C",
	line: "#E5E5E5",
	accent: "#FF5757",
	accentInk: "#0D0D0D",
	link: "#A12A17",
	radius: "6px",
	fontFamily:
		'Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
	monoFamily: '"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
	dark: {
		page: "#141414",
		surface: "#1C1C1C",
		// A step *above* the sheet, matching the console's raised header surface.
		masthead: "#262626",
		mastheadInk: "#F5F5F5",
		footer: "#171717",
		ink: "#F5F5F5",
		inkBody: "#D4D4D4",
		inkMuted: "#A3A3A3",
		line: "#333333",
		// Coral holds its contrast on charcoal, so it needs no dark variant;
		// the link does — the gradient's dark stop disappears against #1C1C1C.
		link: "#FF8A7A",
	},
};

/**
 * One Ingram product's transactional identity. Everything visual comes from
 * {@link ingramTheme}, so a product supplies only what is genuinely its own —
 * which is why a new product is a five-line call, not a stylesheet.
 *
 * ```ts
 * export const brand = ingramBrand({
 * 	productName: "Acme",
 * 	baseUrl: "https://acme.example",
 * 	supportUrl: "/support",
 * });
 * ```
 */
export function ingramBrand(
	identity: Omit<EmailBrand, "theme"> & { theme?: EmailTheme },
): EmailBrand {
	return {
		legalName: "Ingram Technologies",
		...identity,
		theme: identity.theme ?? ingramTheme,
	};
}
