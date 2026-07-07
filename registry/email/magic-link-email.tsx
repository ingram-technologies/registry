import { Heading, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { BaseEmail, EmailButton, styles } from "./base-email";
import type { EmailBrand } from "./base-email";

export interface MagicLinkEmailProps {
	/** Product identity. Defaults to a neutral placeholder — override per app. */
	brand?: EmailBrand;
	/** Fully-formed one-time sign-in link. */
	signInUrl: string;
	/** Override the inbox preview / preheader. Defaults to English. */
	preview?: string;
	/** Override the heading. Defaults to English. Pass translated copy for i18n. */
	heading?: ReactNode;
	/** Override the body paragraph. Defaults to the composed English sentence. */
	body?: ReactNode;
	/** Override the CTA button label. Defaults to "Sign in". */
	ctaLabel?: ReactNode;
}

export function MagicLinkEmail({
	brand,
	signInUrl,
	preview,
	heading,
	body,
	ctaLabel,
}: MagicLinkEmailProps) {
	const productName = brand?.productName ?? "your account";
	return (
		<BaseEmail
			brand={brand}
			preview={preview ?? `Your ${productName} sign-in link`}
		>
			<Heading style={styles.heading}>
				{heading ?? <>Sign in to {productName}</>}
			</Heading>

			<Text style={styles.paragraph}>
				{body ??
					"Click the button below to sign in. This link expires shortly and can only be used once."}
			</Text>

			<EmailButton href={signInUrl} color={brand?.brandColor}>
				{ctaLabel ?? "Sign in"}
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
