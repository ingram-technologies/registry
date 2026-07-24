import { MagicLinkEmail } from "../registry/email/magic-link-email";
import { neutral } from "./brand";

export default function Preview() {
	return (
		<MagicLinkEmail brand={neutral} signInUrl="https://acme.example/magic/tok123" />
	);
}
