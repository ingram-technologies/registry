import { VerificationEmail } from "../registry/email/verification-email";

const brand = {
	productName: "Acme",
	baseUrl: "https://acme.example",
	brandColor: "#2563eb",
	supportUrl: "/contact",
};

export default function Preview() {
	return (
		<VerificationEmail
			brand={brand}
			name="Sam"
			verifyUrl="https://acme.example/verify/xyz789"
		/>
	);
}
