import { Heading, Text } from "react-email";
import type { ReactNode } from "react";
import { BaseEmail, EmailButton, styles } from "./base-email";
import type { EmailBrand } from "./base-email";

export interface VerificationEmailProps {
	/** Product identity. Defaults to a neutral placeholder — override per app. */
	brand?: EmailBrand;
	/** Recipient's display name, if known — personalizes the greeting. */
	name?: string;
	/** Fully-formed verification link (one-time token baked in). */
	verifyUrl: string;
	/** Override the inbox preview / preheader. Defaults to English. */
	preview?: string;
	/** Override the heading. Defaults to English. Pass translated copy for i18n. */
	heading?: ReactNode;
	/** Override the body paragraph. Defaults to the composed English sentence. */
	body?: ReactNode;
	/** Override the CTA button label. Defaults to "Verify email". */
	ctaLabel?: ReactNode;
}

export function VerificationEmail({
	brand,
	name,
	verifyUrl,
	preview,
	heading,
	body,
	ctaLabel,
}: VerificationEmailProps) {
	const productName = brand?.productName ?? "your account";
	const who = name?.trim() || "there";
	return (
		<BaseEmail
			brand={brand}
			preview={preview ?? `Confirm your email for ${productName}`}
		>
			<Heading style={styles.heading}>{heading ?? "Confirm your email"}</Heading>

			<Text style={styles.paragraph}>
				{body ?? (
					<>
						Hi {who}, confirm this address to finish setting up your{" "}
						{productName} account.
					</>
				)}
			</Text>

			<EmailButton href={verifyUrl} color={brand?.brandColor}>
				{ctaLabel ?? "Verify email"}
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
