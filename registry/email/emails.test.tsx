import { describe, expect, it } from "vitest";
import { BaseEmail } from "./base-email";
import { InvitationEmail } from "./invitation-email";
import { MagicLinkEmail } from "./magic-link-email";
import { PasswordResetEmail } from "./password-reset-email";
import { renderEmail } from "./render";
import { neutralTheme } from "./theme";
import type { EmailBrand, EmailTheme } from "./theme";
import { ingramBrand, ingramTheme } from "./theme-ingram";
import { VerificationEmail } from "./verification-email";
import { WelcomeEmail } from "./welcome-email";

/** A theme whose colours appear nowhere else, so an assertion on one proves the
 *  value travelled from the theme into the markup rather than from a default. */
const testTheme: EmailTheme = {
	...neutralTheme,
	accent: "#7C3AED",
	accentInk: "#FFFFFF",
	link: "#4C1D95",
	masthead: "#12005E",
	mastheadInk: "#FFFFFF",
};

const brand: EmailBrand = {
	productName: "Acme",
	baseUrl: "https://acme.example",
	supportUrl: "/contact",
	privacyUrl: "/privacy",
	termsUrl: "/terms",
	theme: testTheme,
};

describe("email templates render to html + text", () => {
	it("invitation carries org, role, inviter, accept link and brand", async () => {
		const { html, text } = await renderEmail(
			<InvitationEmail
				brand={brand}
				inviterName="Alex"
				organizationName="Widgets Inc"
				role="admin"
				acceptUrl="https://acme.example/accept/abc123"
				expiresNote="This invitation expires in 7 days."
			/>,
		);
		expect(html).toContain("Widgets Inc");
		expect(html).toContain("admin");
		expect(html).toContain("Alex");
		expect(html).toContain("https://acme.example/accept/abc123");
		expect(html).toContain("Acme"); // masthead wordmark from brand
		expect(html).toContain("#7C3AED"); // theme accent on the CTA
		expect(text).toContain("Widgets Inc");
		expect(text).toContain("https://acme.example/accept/abc123");
	});

	it("verification carries greeting and verify link", async () => {
		const { html, text } = await renderEmail(
			<VerificationEmail
				brand={brand}
				name="Sam"
				verifyUrl="https://acme.example/verify/xyz789"
			/>,
		);
		expect(html).toContain("Confirm your email");
		expect(html).toContain("Sam");
		expect(html).toContain("https://acme.example/verify/xyz789");
		// React Email uppercases <Heading> text in the plain-text part.
		expect(text.toLowerCase()).toContain("confirm your email");
		expect(text).toContain("https://acme.example/verify/xyz789");
	});

	it("escapes untrusted interpolation (React Email handles this)", async () => {
		const { html } = await renderEmail(
			<InvitationEmail
				brand={brand}
				organizationName={"<script>alert(1)</script>"}
				role="member"
				acceptUrl="https://acme.example/accept/x"
			/>,
		);
		expect(html).not.toContain("<script>alert(1)</script>");
		expect(html).toContain("&lt;script&gt;");
	});

	it("falls back to a neutral wordmark when no brand is passed", async () => {
		const { html } = await renderEmail(
			<BaseEmail preview="hello">
				<p>body</p>
			</BaseEmail>,
		);
		expect(html).toContain("Acme"); // neutralBrand placeholder
	});

	it("magic-link carries the sign-in url", async () => {
		const { html, text } = await renderEmail(
			<MagicLinkEmail
				brand={brand}
				signInUrl="https://acme.example/magic/tok123"
			/>,
		);
		// React inserts <!-- --> markers at interpolation boundaries, so assert
		// the static and dynamic parts separately rather than the joined string.
		expect(html).toContain("Sign in");
		expect(html).toContain("https://acme.example/magic/tok123");
		expect(text).toContain("https://acme.example/magic/tok123");
		expect(text.toLowerCase()).toContain("sign in to acme");
	});

	it("password-reset carries greeting and reset url", async () => {
		const { html, text } = await renderEmail(
			<PasswordResetEmail
				brand={brand}
				name="Sam"
				resetUrl="https://acme.example/reset/tok456"
			/>,
		);
		expect(html).toContain("Reset your password");
		expect(html).toContain("Sam");
		expect(html).toContain("https://acme.example/reset/tok456");
		expect(text).toContain("https://acme.example/reset/tok456");
	});

	it("welcome renders with and without a CTA", async () => {
		const withCta = await renderEmail(
			<WelcomeEmail
				brand={brand}
				name="Sam"
				ctaUrl="https://acme.example/dashboard"
				ctaLabel="Open dashboard"
			/>,
		);
		expect(withCta.html).toContain("Welcome to");
		expect(withCta.html).toContain("https://acme.example/dashboard");
		expect(withCta.html).toContain("Open dashboard");

		const noCta = await renderEmail(<WelcomeEmail brand={brand} name="Sam" />);
		expect(noCta.html).toContain("Welcome to");
		expect(noCta.html).not.toContain("dashboard");
	});

	it("copy is overridable (heading/body/ctaLabel/preview) — e.g. for i18n", async () => {
		const { html } = await renderEmail(
			<InvitationEmail
				brand={brand}
				organizationName="Widgets Inc"
				role="admin"
				acceptUrl="https://acme.example/accept/x"
				heading="Vous êtes invité"
				body="Rejoignez l'équipe."
				ctaLabel="Accepter"
				preview="Invitation en attente"
			/>,
		);
		// Overrides win…
		expect(html).toContain("Vous êtes invité");
		// The apostrophe is HTML-escaped in output, so match around it.
		expect(html).toContain("Rejoignez l");
		expect(html).toContain("équipe");
		expect(html).toContain("Accepter");
		expect(html).toContain("Invitation en attente");
		// …and the English defaults are gone.
		expect(html).not.toContain("You're invited to");
		expect(html).not.toContain("Accept invitation");
	});
});

describe("the shell is themeable, not hard-coded", () => {
	it("takes every surface colour from the theme, none from the shell", async () => {
		const { html } = await renderEmail(
			<BaseEmail brand={brand} preview="hello">
				<p>body</p>
			</BaseEmail>,
		);
		expect(html).toContain(testTheme.masthead);
		expect(html).toContain(testTheme.page);
		// The blue of the neutral default must not leak past an override.
		expect(html).not.toContain(neutralTheme.accent);
	});

	it("pairs every inline text colour with its dark-mode class", async () => {
		// An inline colour with no class is invisible the moment a client
		// honours prefers-color-scheme — ink on ink — and every light-mode
		// assertion still passes. So pin the pairing on the elements a
		// *template* renders, which is where the shell can't add the class.
		const { html } = await renderEmail(
			<VerificationEmail
				brand={brand}
				name="Sam"
				verifyUrl="https://acme.example/verify/x"
			/>,
		);
		for (const tag of html.match(/<(?:h1|p|a)\b[^>]*>/g) ?? []) {
			if (!/style="[^"]*(?<!background-)color:/.test(tag)) continue;
			expect(tag, `uncoloured in dark mode: ${tag}`).toMatch(/class="em-/);
		}
	});

	it("lets no library default colour through", async () => {
		const { html } = await renderEmail(
			<VerificationEmail
				brand={brand}
				name="Sam"
				verifyUrl="https://acme.example/verify/x"
			/>,
		);
		// React Email colours a bare <Link> with its own blue. Every anchor in
		// the shell must state a themed colour instead.
		expect(html).not.toContain("#067df7");
	});

	it("emits the dark-mode overrides a theme declares", async () => {
		const { html } = await renderEmail(
			<BaseEmail brand={brand} preview="hello">
				<p>body</p>
			</BaseEmail>,
		);
		expect(html).toContain("prefers-color-scheme:dark");
		expect(html).toContain(`.em-page{background-color:${neutralTheme.dark?.page}`);
	});

	it("omits the dark block entirely for a theme without one", async () => {
		const lightOnly: EmailBrand = {
			...brand,
			theme: { ...testTheme, dark: undefined },
		};
		const { html } = await renderEmail(
			<BaseEmail brand={lightOnly} preview="hello">
				<p>body</p>
			</BaseEmail>,
		);
		expect(html).not.toContain("prefers-color-scheme");
	});

	it("renders footer links only for the URLs a brand supplies", async () => {
		const supportOnly: EmailBrand = {
			productName: "Acme",
			baseUrl: "https://acme.example",
			supportUrl: "/contact",
		};
		const { html } = await renderEmail(
			<BaseEmail brand={supportOnly} preview="hello">
				<p>body</p>
			</BaseEmail>,
		);
		expect(html).toContain("https://acme.example/contact");
		expect(html).not.toContain("Privacy");
		expect(html).not.toContain("Terms");
	});
});

describe("the Ingram theme", () => {
	it("dresses a product without the product knowing any colours", async () => {
		const acme = ingramBrand({
			productName: "Acme",
			baseUrl: "https://acme.example",
		});
		const { html } = await renderEmail(
			<VerificationEmail
				brand={acme}
				name="Sam"
				verifyUrl="https://acme.example/verify/x"
			/>,
		);
		expect(html).toContain(ingramTheme.accent);
		// Coral carries near-black text — white on coral is 3.1:1 and fails AA.
		expect(html).toContain(ingramTheme.accentInk);
		expect(html).toContain("Ingram Technologies"); // default legal name
	});

	it("lets a product override the legal name it files under", async () => {
		const acme = ingramBrand({
			productName: "Acme",
			baseUrl: "https://acme.example",
			legalName: "Acme Holdings",
		});
		const { html } = await renderEmail(
			<BaseEmail brand={acme} preview="hello">
				<p>body</p>
			</BaseEmail>,
		);
		expect(html).toContain("Acme Holdings");
		expect(html).not.toContain("Ingram Technologies");
	});
});
