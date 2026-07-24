import { WelcomeEmail } from "../registry/email/welcome-email";
import { neutral } from "./brand";

export default function Preview() {
	return (
		<WelcomeEmail
			brand={neutral}
			name="Sam"
			ctaUrl="https://acme.example/dashboard"
			ctaLabel="Open dashboard"
		/>
	);
}
