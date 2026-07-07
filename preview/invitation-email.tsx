import { InvitationEmail } from "../registry/email/invitation-email";

const brand = {
	productName: "Acme",
	baseUrl: "https://acme.example",
	brandColor: "#2563eb",
	supportUrl: "/contact",
	privacyUrl: "/privacy",
	termsUrl: "/terms",
};

export default function Preview() {
	return (
		<InvitationEmail
			brand={brand}
			inviterName="Alex Rivera"
			organizationName="Widgets Inc"
			role="admin"
			acceptUrl="https://acme.example/accept/abc123"
			expiresNote="This invitation expires in 7 days."
		/>
	);
}
