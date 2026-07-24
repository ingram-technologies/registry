import { VerificationEmail } from "../registry/email/verification-email";
import { neutral } from "./brand";

export default function Preview() {
	return (
		<VerificationEmail
			brand={neutral}
			name="Sam"
			verifyUrl="https://acme.example/verify/xyz789"
		/>
	);
}
