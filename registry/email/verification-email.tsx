import { Heading, Text } from "@react-email/components";
import { BaseEmail, EmailButton, styles } from "./base-email";
import type { EmailBrand } from "./base-email";

export interface VerificationEmailProps {
	/** Product identity. Defaults to a neutral placeholder — override per app. */
	brand?: EmailBrand;
	/** Recipient's display name, if known — personalizes the greeting. */
	name?: string;
	/** Fully-formed verification link (one-time token baked in). */
	verifyUrl: string;
}

export function VerificationEmail({ brand, name, verifyUrl }: VerificationEmailProps) {
	const productName = brand?.productName ?? "your account";
	const who = name?.trim() || "there";
	return (
		<BaseEmail brand={brand} preview={`Confirm your email for ${productName}`}>
			<Heading style={styles.heading}>Confirm your email</Heading>

			<Text style={styles.paragraph}>
				Hi {who}, confirm this address to finish setting up your {productName}{" "}
				account.
			</Text>

			<EmailButton href={verifyUrl} color={brand?.brandColor}>
				Verify email
			</EmailButton>

			<Text style={styles.muted}>
				Or paste this link into your browser:
				<br />
				{verifyUrl}
			</Text>

			<Text style={styles.muted}>
				If you didn't create this account, you can ignore this email.
			</Text>
		</BaseEmail>
	);
}
