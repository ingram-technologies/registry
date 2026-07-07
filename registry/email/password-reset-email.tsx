import { Heading, Text } from "@react-email/components";
import { BaseEmail, EmailButton, styles } from "./base-email";
import type { EmailBrand } from "./base-email";

export interface PasswordResetEmailProps {
	/** Product identity. Defaults to a neutral placeholder — override per app. */
	brand?: EmailBrand;
	/** Recipient's display name, if known — personalizes the greeting. */
	name?: string;
	/** Fully-formed one-time reset link. */
	resetUrl: string;
}

export function PasswordResetEmail({ brand, name, resetUrl }: PasswordResetEmailProps) {
	const productName = brand?.productName ?? "your account";
	const who = name?.trim() || "there";
	return (
		<BaseEmail brand={brand} preview={`Reset your ${productName} password`}>
			<Heading style={styles.heading}>Reset your password</Heading>

			<Text style={styles.paragraph}>
				Hi {who}, we received a request to reset the password for your{" "}
				{productName} account. Click below to choose a new one — the link
				expires shortly.
			</Text>

			<EmailButton href={resetUrl} color={brand?.brandColor}>
				Reset password
			</EmailButton>

			<Text style={styles.muted}>
				Or paste this link into your browser:
				<br />
				{resetUrl}
			</Text>

			<Text style={styles.muted}>
				If you didn't request a password reset, you can safely ignore this email
				— your password won't change.
			</Text>
		</BaseEmail>
	);
}
