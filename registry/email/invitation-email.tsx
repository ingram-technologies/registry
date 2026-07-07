import { Heading, Text } from "@react-email/components";
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
}

export function InvitationEmail({
	brand,
	inviterName = "A teammate",
	organizationName,
	role,
	acceptUrl,
	expiresNote,
}: InvitationEmailProps) {
	const productName = brand?.productName ?? "us";
	return (
		<BaseEmail
			brand={brand}
			preview={`${inviterName} invited you to join ${organizationName}`}
		>
			<Heading style={styles.heading}>
				You're invited to {organizationName}
			</Heading>

			<Text style={styles.paragraph}>
				{inviterName} invited you to join <strong>{organizationName}</strong> on{" "}
				{productName} as <strong>{role}</strong>.
			</Text>

			<EmailButton href={acceptUrl} color={brand?.brandColor}>
				Accept invitation
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
