import { PasswordResetEmail } from "../registry/email/password-reset-email";

const brand = {
	productName: "Acme",
	baseUrl: "https://acme.example",
	brandColor: "#2563eb",
	supportUrl: "/contact",
};

export default function Preview() {
	return (
		<PasswordResetEmail
			brand={brand}
			name="Sam"
			resetUrl="https://acme.example/reset/tok456"
		/>
	);
}
