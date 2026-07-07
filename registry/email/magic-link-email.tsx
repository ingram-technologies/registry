import { Heading, Text } from "@react-email/components";
import { BaseEmail, EmailButton, styles } from "./base-email";
import type { EmailBrand } from "./base-email";

export interface MagicLinkEmailProps {
	/** Product identity. Defaults to a neutral placeholder — override per app. */
	brand?: EmailBrand;
	/** Fully-formed one-time sign-in link. */
	signInUrl: string;
}

export function MagicLinkEmail({ brand, signInUrl }: MagicLinkEmailProps) {
	const productName = brand?.productName ?? "your account";
	return (
		<BaseEmail brand={brand} preview={`Your ${productName} sign-in link`}>
			<Heading style={styles.heading}>Sign in to {productName}</Heading>

			<Text style={styles.paragraph}>
				Click the button below to sign in. This link expires shortly and can
				only be used once.
			</Text>

			<EmailButton href={signInUrl} color={brand?.brandColor}>
				Sign in
			</EmailButton>

			<Text style={styles.muted}>
				Or paste this link into your browser:
				<br />
				{signInUrl}
			</Text>

			<Text style={styles.muted}>
				If you didn't request this, you can ignore this email.
			</Text>
		</BaseEmail>
	);
}
