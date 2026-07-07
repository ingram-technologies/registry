# @ingram-tech/registry

A [shadcn](https://ui.shadcn.com/docs/registry)-style component registry for
Ingram Technologies' fleet. Components are **copied into** a consuming app (via
the shadcn CLI), so each product **owns and rebrands** the source — we share the
_technical_ foundation, not a locked _design_ foundation.

> **Why copy-in, not a runtime package?** Our apps are independent products with
> their own branding and product guidelines. A published component library
> forces one look behind a prop wall; a registry hands you a high-quality,
> cross-client-tested starting point that you then make yours. Hard correctness
> (HTML escaping, email-client quirks) stays in the shared dependencies
> (`@react-email/*`, [`@ingram-tech/nk-email`](https://github.com/ingram-technologies/nextkit/tree/main/packages/nk-email));
> the presentation you own.

Registry endpoint: **`https://ingram-technologies.github.io/registry`**
(served from `/r/*.json` by GitHub Pages).

## What's here

Currently one layer — **email** (transactional React Email templates):

| Item                 | What it is                                                             |
| -------------------- | --------------------------------------------------------------------- |
| `email-base`         | Brand-neutral shell + CTA button + shared styles + `renderEmail()`    |
| `email-invitation`   | Organization/team invitation (built on `email-base`)                  |
| `email-verification` | Email-address verification (built on `email-base`)                    |

## Consuming it

One-off:

```bash
npx shadcn@latest add https://ingram-technologies.github.io/registry/r/email-invitation.json
```

Or register the namespace once (in the app's `components.json`) and add by name:

```bash
npx shadcn@latest registry add @ingram=https://ingram-technologies.github.io/registry/r/{name}.json
npx shadcn@latest add @ingram/email-invitation
```

`registryDependencies` pull `email-base` automatically, and the item's npm
`dependencies` (`@react-email/components`, `@react-email/render`) install into
the app — this is what brings React Email into an app that didn't have it.

Files land in `components/emails/` and `lib/email/`. **They're yours now** —
change colors, copy, layout to fit the product.

### Rendering + sending

The registry renders; your app sends (via `@ingram-tech/nk-email` or any
transport):

```tsx
import { renderEmail } from "@/lib/email/render";
import { InvitationEmail } from "@/components/emails/invitation-email";
import { fromAddress, sendEmail } from "@ingram-tech/nk-email";

const brand = {
	productName: "Acme",
	baseUrl: "https://acme.example",
	logoUrl: "https://acme.example/logo.png",
	brandColor: "#2563eb",
	supportUrl: "/contact",
};

const { html, text } = await renderEmail(
	<InvitationEmail
		brand={brand}
		inviterName="Alex"
		organizationName="Widgets Inc"
		role="admin"
		acceptUrl="https://acme.example/accept/abc123"
		expiresNote="This invitation expires in 7 days."
	/>,
);

await sendEmail({ to, from: fromAddress("Acme", "invites"), subject, html, text });
```

Pass `brand` at each render, or (more common) wrap `BaseEmail` in a small local
component that fills it in from your config so templates stay terse.

## Developing this registry

```bash
bun install
bun run preview      # React Email preview server (preview/*.tsx)
bun run test         # renders every template, asserts content + escaping
bun run type-check
bun run check        # oxlint + oxfmt --check + site-name guard
bun run build        # shadcn build -> public/r/*.json
```

House style matches nextkit: tabs / width 4 / 88 columns (oxfmt), `.tsx`
sources under `registry/`. This is a **public** repo — the
[`check-site-names`](./scripts/check-site-names.ts) guard blocks consumer-site
names in any tracked file, path, or unpushed commit message.

### Adding a component

1. Add the source under `registry/<layer>/`.
2. Register it in [`registry.json`](./registry.json) with `files` targets and
   any `dependencies` / `registryDependencies`.
3. Add a `preview/*.tsx` and a render assertion in the test.
4. `bun run check && bun run build` — CI deploys to Pages on merge to `main`.

## Roadmap: two layers

This is built to grow into two layers, distributed as shadcn namespaces:

- **shared** — brand-neutral primitives usable by any app (what's here today).
- **ingram** — Ingram-flavored components that assume our conventions.

Email is the first slice; more component families follow.
