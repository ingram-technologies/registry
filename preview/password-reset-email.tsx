import { PasswordResetEmail } from "../registry/email/password-reset-email";
import { neutral } from "./brand";

export default function Preview() {
	return (
		<PasswordResetEmail
			brand={neutral}
			name="Sam"
			resetUrl="https://acme.example/reset/tok456"
		/>
	);
}
