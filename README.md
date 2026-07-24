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
> (`react-email`, [`@ingram-tech/nk-email`](https://github.com/ingram-technologies/nextkit/tree/main/packages/nk-email));
> the presentation you own.

Registry endpoint: **`https://ingram-technologies.github.io/registry`**
(served from `/r/*.json` by GitHub Pages).

## What's here

Two layers so far: **email** (transactional React Email templates) and **ui**
(the shared dashboard component kit).

### email

| Item                   | What it is                                                              |
| ---------------------- | ----------------------------------------------------------------------- |
| `email-base`           | Brand-neutral shell + CTA button + wire-link + `EmailTheme` + `renderEmail()` |
| `email-theme-ingram`   | The Ingram house theme — one object, drop-in over `email-base`          |
| `email-invitation`     | Organization/team invitation (built on `email-base`)                   |
| `email-verification`   | Email-address verification (built on `email-base`)                     |
| `email-magic-link`     | Passwordless / magic-link sign-in (built on `email-base`)              |
| `email-password-reset` | Password reset (built on `email-base`)                                 |
| `email-welcome`        | Post-signup welcome, optional CTA (built on `email-base`)              |

**Templates are neutral; themes are data.** The shell renders four bands — an
accent rule, a masthead, the message, a footer — and takes every colour, font,
and radius from an `EmailTheme`. No template names a colour, so a house style is
one object rather than a fork of six files, and a product that wants its own look
writes a different object instead of editing templates. `email-theme-ingram` is
the first such theme; a product with its own identity ships beside it, not
instead of it.

The shell also handles what's easy to forget in email: a `prefers-color-scheme`
block generated from the theme's own `dark` overrides (an inline colour with no
dark class is invisible on a dark client, and light-mode tests never catch it),
`@media` padding for narrow screens, and a monospace fallback line carrying the
CTA's URL for clients that strip buttons.

### ui

The common vocabulary for the fleet's organization-dashboard apps, so every
product's console reads as one system. Primitives are built on
[Base UI](https://base-ui.com) (the fleet's primitive layer going forward) +
`class-variance-authority`, styled exclusively through the semantic token
vocabulary (`bg-primary`, `text-muted-foreground`, …) — so the same source
renders correctly in any app that defines the tokens. Sources import
`cn` from `@/lib/utils` (every app has it from `shadcn init`).

**Theme** — apply once per app; everything below reads these variables:

| Item              | What it is                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `dashboard-theme` | Shared token set: chroma-0 neutral ramp, one signal-red primary, dark-first, success/warning, chart + sidebar tokens |

**Primitives** (Tailwind v4, `components/ui/*`):

`button` · `badge` · `card` · `input` · `textarea` · `label` · `select` ·
`dialog` · `dropdown-menu` · `tooltip` · `tabs` · `avatar` · `separator` ·
`skeleton` · `table` · `toaster`

**Dashboard patterns** (the pieces list pages share):

| Item                    | What it is                                                            |
| ----------------------- | --------------------------------------------------------------------- |
| `page-header`           | The one page-title bar: leading slot, icon chip, title + description, actions |
| `empty-state`           | Zero-data placeholder that teaches the next step                       |
| `stat-card`             | Compact metric tile + `compactNumber()` formatter                      |
| `status-badge`          | Semantic status pill with one consistent tone mapping                  |
| `delete-confirm-dialog` | Type-to-confirm destructive dialog                                     |

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
`dependencies` (`react-email`) install into
the app — this is what brings React Email into an app that didn't have it.

Files land in `components/emails/` and `lib/email/`. **They're yours now** —
change colors, copy, layout to fit the product.

### Rendering + sending

The registry renders; your app sends (via `@ingram-tech/nk-email` or any
transport):

```tsx
import { renderEmail } from "@/lib/email/render";
import { InvitationEmail } from "@/components/emails/invitation-email";
import { ingramBrand } from "@/components/emails/theme-ingram";
import { fromAddress, sendEmail } from "@ingram-tech/nk-email";

const brand = ingramBrand({
	productName: "Acme",
	baseUrl: "https://acme.example",
	supportUrl: "/contact",
});

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

Without `ingramBrand`, a bare `{ productName, baseUrl }` renders under the
neutral theme. Define the brand once per app and pass it at each render.

### Theming

`brand.theme` is an `EmailTheme` — surfaces, three ink levels, one accent and the
text colour that sits on it, a link colour, a radius, and two font stacks, plus
optional `dark` overrides. To take a product somewhere else, spread and change
what differs:

```ts
import { ingramTheme } from "@/components/emails/theme-ingram";

const brand = ingramBrand({
	productName: "Acme",
	baseUrl: "https://acme.example",
	theme: { ...ingramTheme, accent: "#0F766E", accentInk: "#FFFFFF" },
});
```

Two rules when you do: **the accent's text colour is not automatic** — check
`accentInk` against `accent` at 4.5:1, since a mid-tone accent usually needs
near-black rather than white — and **a `link` must clear 4.5:1 on `surface`**,
which most brand accents don't. Templates read these through `emailStyles(brand)`
and never write a colour of their own, so getting the theme right is the whole
job.

### Overriding copy

Every template's visible copy is overridable via optional props — `heading`,
`body`, `ctaLabel`, `preview` — each defaulting to English. Pass your own strings
(or translated ones, for i18n) without touching the source:

```tsx
<InvitationEmail
	brand={brand}
	organizationName="Widgets Inc"
	role="admin"
	acceptUrl={acceptUrl}
	heading="Vous êtes invité"
	body="Rejoignez l'équipe."
	ctaLabel="Accepter"
/>
```

Deliberately high-level: the headline, body, CTA, and preheader are props;
deeper structure and the secondary boilerplate (the "paste this link" line,
footer chrome) you change by editing the copied source you own. Style is the
same story — `brand` covers logo/color/name; anything deeper, edit the source.

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
3. Add a render assertion in the layer's test (email items also get a
   `preview/*.tsx` for the React Email preview server).
4. `bun run check && bun run build` — CI deploys to Pages on merge to `main`.

## Roadmap

Email and the dashboard ui kit are the first two slices. Next: the
organization-dashboard shell — app sidebar, organization/workspace switcher,
user menu, and the Better Auth organization surfaces (members + invitations
manager, accept-invitation flow) — so a new org-based product starts from a
working console instead of a blank page.
