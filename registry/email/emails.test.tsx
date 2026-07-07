import { describe, expect, it } from "vitest";
import { BaseEmail } from "./base-email";
import type { EmailBrand } from "./base-email";
import { InvitationEmail } from "./invitation-email";
import { MagicLinkEmail } from "./magic-link-email";
import { PasswordResetEmail } from "./password-reset-email";
import { renderEmail } from "./render";
import { VerificationEmail } from "./verification-email";
import { WelcomeEmail } from "./welcome-email";

const brand: EmailBrand = {
	productName: "Acme",
	baseUrl: "https://acme.example",
	brandColor: "#7c3aed",
	supportUrl: "/contact",
	privacyUrl: "/privacy",
	termsUrl: "/terms",
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
		expect(html).toContain("Acme"); // footer wordmark from brand
		expect(html).toContain("#7c3aed"); // brand accent on the CTA
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
		expect(html).toContain("Acme"); // defaultBrand placeholder
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
