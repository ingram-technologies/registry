import { Heading, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { BaseEmail, EmailButton, styles } from "./base-email";
import type { EmailBrand } from "./base-email";

export interface WelcomeEmailProps {
	/** Product identity. Defaults to a neutral placeholder — override per app. */
	brand?: EmailBrand;
	/** Recipient's display name, if known — personalizes the greeting. */
	name?: string;
	/** Optional call-to-action link, e.g. the dashboard. */
	ctaUrl?: string;
	/** CTA button label. Defaults to "Get started". */
	ctaLabel?: ReactNode;
	/** Override the inbox preview / preheader. Defaults to English. */
	preview?: string;
	/** Override the heading. Defaults to English. Pass translated copy for i18n. */
	heading?: ReactNode;
	/** Override the body paragraph. Defaults to the composed English sentence. */
	body?: ReactNode;
}

export function WelcomeEmail({
	brand,
	name,
	ctaUrl,
	ctaLabel = "Get started",
	preview,
	heading,
	body,
}: WelcomeEmailProps) {
	const productName = brand?.productName ?? "us";
	const who = name?.trim() || "there";
	return (
		<BaseEmail brand={brand} preview={preview ?? `Welcome to ${productName}`}>
			<Heading style={styles.heading}>
				{heading ?? <>Welcome to {productName}</>}
			</Heading>

			<Text style={styles.paragraph}>
				{body ?? (
					<>
						Hi {who}, thanks for joining {productName}. We're glad to have
						you.
					</>
				)}
			</Text>

			{ctaUrl ? (
				<EmailButton href={ctaUrl} color={brand?.brandColor}>
					{ctaLabel}
				</EmailButton>
			) : null}
		</BaseEmail>
	);
}
