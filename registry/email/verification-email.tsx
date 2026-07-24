import { Heading, Text } from "react-email";
import type { ReactNode } from "react";
import { BaseEmail, EmailButton, WireLink, emailStyles } from "./base-email";
import type { EmailBrand } from "./theme";

export interface VerificationEmailProps {
	/** Product identity. Defaults to a neutral placeholder — override per app. */
	brand?: EmailBrand;
	/** Recipient's display name, if known — personalizes the greeting. */
	name?: string;
	/** Fully-formed one-time verification link. */
	verifyUrl: string;
	/** Override the inbox preview / preheader. Defaults to English. */
	preview?: string;
	/** Override the heading. Defaults to English. Pass translated copy for i18n. */
	heading?: ReactNode;
	/** Override the body paragraph. Defaults to the composed English sentence. */
	body?: ReactNode;
	/** Override the CTA button label. Defaults to "Confirm email". */
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
	const s = emailStyles(brand);
	const productName = brand?.productName ?? "your account";
	const who = name?.trim() || "there";
	return (
		<BaseEmail
			brand={brand}
			preview={preview ?? `Confirm your email address for ${productName}`}
		>
			<Heading {...s.heading}>{heading ?? "Confirm your email address"}</Heading>

			<Text {...s.paragraph}>
				{body ?? (
					<>
						Hi {who}, confirm this address to finish setting up your{" "}
						{productName} account.
					</>
				)}
			</Text>

			<EmailButton brand={brand} href={verifyUrl}>
				{ctaLabel ?? "Confirm email"}
			</EmailButton>

			<Text {...s.muted}>
				If you didn't create this account, ignore this email — nothing happens.
			</Text>

			<WireLink brand={brand} url={verifyUrl} />
		</BaseEmail>
	);
}
