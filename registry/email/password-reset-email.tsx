import { Heading, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { BaseEmail, EmailButton, styles } from "./base-email";
import type { EmailBrand } from "./base-email";

export interface PasswordResetEmailProps {
	/** Product identity. Defaults to a neutral placeholder — override per app. */
	brand?: EmailBrand;
	/** Recipient's display name, if known — personalizes the greeting. */
	name?: string;
	/** Fully-formed one-time reset link. */
	resetUrl: string;
	/** Override the inbox preview / preheader. Defaults to English. */
	preview?: string;
	/** Override the heading. Defaults to English. Pass translated copy for i18n. */
	heading?: ReactNode;
	/** Override the body paragraph. Defaults to the composed English sentence. */
	body?: ReactNode;
	/** Override the CTA button label. Defaults to "Reset password". */
	ctaLabel?: ReactNode;
}

export function PasswordResetEmail({
	brand,
	name,
	resetUrl,
	preview,
	heading,
	body,
	ctaLabel,
}: PasswordResetEmailProps) {
	const productName = brand?.productName ?? "your account";
	const who = name?.trim() || "there";
	return (
		<BaseEmail
			brand={brand}
			preview={preview ?? `Reset your ${productName} password`}
		>
			<Heading style={styles.heading}>{heading ?? "Reset your password"}</Heading>

			<Text style={styles.paragraph}>
				{body ?? (
					<>
						Hi {who}, we received a request to reset the password for your{" "}
						{productName} account. Click below to choose a new one — the
						link expires shortly.
					</>
				)}
			</Text>

			<EmailButton href={resetUrl} color={brand?.brandColor}>
				{ctaLabel ?? "Reset password"}
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
