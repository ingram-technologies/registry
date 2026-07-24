import { Heading, Text } from "react-email";
import type { ReactNode } from "react";
import { BaseEmail, EmailButton, WireLink, emailStyles } from "./base-email";
import type { EmailBrand } from "./theme";

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
	const s = emailStyles(brand);
	const productName = brand?.productName ?? "your account";
	const who = name?.trim() || "there";
	return (
		<BaseEmail
			brand={brand}
			preview={preview ?? `Reset your ${productName} password`}
		>
			<Heading {...s.heading}>{heading ?? "Reset your password"}</Heading>

			<Text {...s.paragraph}>
				{body ?? (
					<>
						Hi {who}, we received a request to reset the password on your{" "}
						{productName} account. Choose a new one below — the link expires
						shortly and works once.
					</>
				)}
			</Text>

			<EmailButton brand={brand} href={resetUrl}>
				{ctaLabel ?? "Reset password"}
			</EmailButton>

			<Text {...s.muted}>
				If you didn't request this, ignore this email — your password won't
				change.
			</Text>

			<WireLink brand={brand} url={resetUrl} />
		</BaseEmail>
	);
}
