import { ingramBrand } from "../registry/email/theme-ingram";
import type { EmailBrand } from "../registry/email/theme";

/** The untouched default: what a template looks like before anyone themes it. */
export const neutral: EmailBrand = {
	productName: "Acme",
	baseUrl: "https://acme.example",
	supportUrl: "/contact",
	privacyUrl: "/privacy",
	termsUrl: "/terms",
};

/** The same templates under the house theme — the whole diff is this object. */
export const ingram: EmailBrand = ingramBrand({
	productName: "Acme",
	baseUrl: "https://acme.example",
	supportUrl: "/contact",
	privacyUrl: "/privacy",
	termsUrl: "/terms",
});
