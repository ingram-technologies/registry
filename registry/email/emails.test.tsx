import { describe, expect, it } from "vitest";
import { BaseEmail } from "./base-email";
import type { EmailBrand } from "./base-email";
import { InvitationEmail } from "./invitation-email";
import { renderEmail } from "./render";
import { VerificationEmail } from "./verification-email";

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
});
