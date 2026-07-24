import { Heading, Text } from "react-email";
import type { ReactNode } from "react";
import { BaseEmail, EmailButton, WireLink, emailStyles } from "./base-email";
import type { EmailBrand } from "./theme";

export interface InvitationEmailProps {
	/** Product identity. Defaults to a neutral placeholder — override per app. */
	brand?: EmailBrand;
	/** Display name of whoever sent the invite. */
	inviterName?: string;
	/** Organization / team the invitee is being asked to join. */
	organizationName: string;
	/** Role they'll be granted (e.g. "member", "admin"). */
	role: string;
	/** Fully-formed accept link — the app builds this from its own routes. */
	acceptUrl: string;
	/** Expiry line, e.g. "This invitation expires in 7 days." */
	expiresNote?: ReactNode;
	/** Override the inbox preview / preheader. Defaults to English. */
	preview?: string;
	/** Override the heading. Defaults to English. Pass translated copy for i18n. */
	heading?: ReactNode;
	/** Override the body paragraph. Defaults to the composed English sentence. */
	body?: ReactNode;
	/** Override the CTA button label. Defaults to "Accept invitation". */
	ctaLabel?: ReactNode;
}

export function InvitationEmail({
	brand,
	inviterName = "A teammate",
	organizationName,
	role,
	acceptUrl,
	expiresNote,
	preview,
	heading,
	body,
	ctaLabel,
}: InvitationEmailProps) {
	const s = emailStyles(brand);
	const productName = brand?.productName ?? "us";
	return (
		<BaseEmail
			brand={brand}
			preview={
				preview ?? `${inviterName} invited you to join ${organizationName}`
			}
		>
			<Heading {...s.heading}>
				{heading ?? <>You're invited to {organizationName}</>}
			</Heading>

			<Text {...s.paragraph}>
				{body ?? (
					<>
						{inviterName} invited you to join{" "}
						<strong>{organizationName}</strong> on {productName} as{" "}
						<strong>{role}</strong>.
					</>
				)}
			</Text>

			<EmailButton brand={brand} href={acceptUrl}>
				{ctaLabel ?? "Accept invitation"}
			</EmailButton>

			{expiresNote ? <Text {...s.muted}>{expiresNote}</Text> : null}

			<WireLink brand={brand} url={acceptUrl} />
		</BaseEmail>
	);
}
