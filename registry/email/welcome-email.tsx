import { Heading, Text } from "@react-email/components";
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
	ctaLabel?: string;
}

export function WelcomeEmail({
	brand,
	name,
	ctaUrl,
	ctaLabel = "Get started",
}: WelcomeEmailProps) {
	const productName = brand?.productName ?? "us";
	const who = name?.trim() || "there";
	return (
		<BaseEmail brand={brand} preview={`Welcome to ${productName}`}>
			<Heading style={styles.heading}>Welcome to {productName}</Heading>

			<Text style={styles.paragraph}>
				Hi {who}, thanks for joining {productName}. We're glad to have you.
			</Text>

			{ctaUrl ? (
				<EmailButton href={ctaUrl} color={brand?.brandColor}>
					{ctaLabel}
				</EmailButton>
			) : null}
		</BaseEmail>
	);
}
