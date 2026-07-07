import { render } from "@react-email/render";
import type { ReactElement } from "react";

/**
 * Render a React Email element to both MIME parts. Hand the result straight to
 * your transactional email transport:
 *
 *   const { html, text } = await renderEmail(<InvitationEmail {...props} />);
 *   await sendEmail({ to, from, subject, html, text });
 *
 * Kept transport-agnostic on purpose — the registry renders, your app sends.
 */
export async function renderEmail(
	element: ReactElement,
): Promise<{ html: string; text: string }> {
	const [html, text] = await Promise.all([
		render(element),
		render(element, { plainText: true }),
	]);
	return { html, text };
}
