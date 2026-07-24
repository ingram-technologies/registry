import { Heading, Text } from "react-email";
import type { ReactNode } from "react";
import { BaseEmail, EmailButton, WireLink, emailStyles } from "./base-email";
import type { EmailBrand } from "./theme";

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
	const s = emailStyles(brand);
	const productName = brand?.productName ?? "your account";
	return (
		<BaseEmail
			brand={brand}
			preview={preview ?? `Your ${productName} sign-in link`}
		>
			<Heading {...s.heading}>{heading ?? <>Sign in to {productName}</>}</Heading>

			<Text {...s.paragraph}>
				{body ??
					"Use the button below to sign in. The link expires shortly and works once."}
			</Text>

			<EmailButton brand={brand} href={signInUrl}>
				{ctaLabel ?? "Sign in"}
			</EmailButton>

			<Text {...s.muted}>
				If you didn't request this, ignore this email — nobody is signed in.
			</Text>

			<WireLink brand={brand} url={signInUrl} />
		</BaseEmail>
	);
}
