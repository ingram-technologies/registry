import { InvitationEmail } from "../registry/email/invitation-email";
import { ingram } from "./brand";

/** The neutral invitation, rethemed. Compare against `invitation-email`: the
 *  templates are byte-identical, only the brand object differs. */
export default function Preview() {
	return (
		<InvitationEmail
			brand={ingram}
			inviterName="Alex Rivera"
			organizationName="Widgets Inc"
			role="admin"
			acceptUrl="https://acme.example/accept/abc123"
			expiresNote="This invitation expires in 7 days."
		/>
	);
}
