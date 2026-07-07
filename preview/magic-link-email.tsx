import { MagicLinkEmail } from "../registry/email/magic-link-email";

const brand = {
	productName: "Acme",
	baseUrl: "https://acme.example",
	brandColor: "#2563eb",
	supportUrl: "/contact",
};

export default function Preview() {
	return (
		<MagicLinkEmail brand={brand} signInUrl="https://acme.example/magic/tok123" />
	);
}
