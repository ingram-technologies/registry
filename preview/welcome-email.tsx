import { WelcomeEmail } from "../registry/email/welcome-email";

const brand = {
	productName: "Acme",
	baseUrl: "https://acme.example",
	brandColor: "#2563eb",
	supportUrl: "/contact",
};

export default function Preview() {
	return (
		<WelcomeEmail
			brand={brand}
			name="Sam"
			ctaUrl="https://acme.example/dashboard"
			ctaLabel="Open dashboard"
		/>
	);
}
