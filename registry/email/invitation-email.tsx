import { Heading, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { BaseEmail, EmailButton, styles } from "./base-email";
import type { EmailBrand } from "./base-email";

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
	/** Optional expiry line, e.g. "This invitation expires in 7 days." */
	expiresNote?: string;
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
	const productName = brand?.productName ?? "us";
	return (
		<BaseEmail
			brand={brand}
			preview={
				preview ?? `${inviterName} invited you to join ${organizationName}`
			}
		>
			<Heading style={styles.heading}>
				{heading ?? <>You're invited to {organizationName}</>}
			</Heading>

			<Text style={styles.paragraph}>
				{body ?? (
					<>
						{inviterName} invited you to join{" "}
						<strong>{organizationName}</strong> on {productName} as{" "}
						<strong>{role}</strong>.
					</>
				)}
			</Text>

			<EmailButton href={acceptUrl} color={brand?.brandColor}>
				{ctaLabel ?? "Accept invitation"}
			</EmailButton>

			{expiresNote ? <Text style={styles.muted}>{expiresNote}</Text> : null}

			<Text style={styles.muted}>
				Or paste this link into your browser:
				<br />
				{acceptUrl}
			</Text>
		</BaseEmail>
	);
}
