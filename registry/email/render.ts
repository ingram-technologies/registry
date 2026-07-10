import type { ReactElement } from "react";
import { render, toPlainText } from "react-email";

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
	const html = await render(element);
	return { html, text: toPlainText(html) };
}
