"use client";

import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { isValidElement } from "react";

import { cn } from "@/lib/utils";

/**
 * Base UI button-like components default `nativeButton` to true; a swapped-in
 * non-`<button>` render target (e.g. a Next.js Link) must drop native button
 * semantics, or Base UI warns.
 */
function rendersNativeButton(render: unknown): boolean {
	return render === undefined || (isValidElement(render) && render.type === "button");
}

function NavigationMenu({
	className,
	children,
	align = "start",
	sideOffset = 6,
	// Base UI's 50ms default closes the popup the moment the pointer strays a
	// few px outside it; give hover-out a forgiving grace period instead.
	closeDelay = 300,
	...props
}: NavigationMenuPrimitive.Root.Props &
	Pick<NavigationMenuPrimitive.Positioner.Props, "align" | "sideOffset">) {
	return (
		<NavigationMenuPrimitive.Root
			data-slot="navigation-menu"
			closeDelay={closeDelay}
			className={cn(
				"group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
				className,
			)}
			{...props}
		>
			{children}
			<NavigationMenuViewport align={align} sideOffset={sideOffset} />
		</NavigationMenuPrimitive.Root>
	);
}

function NavigationMenuList({
	className,
	...props
}: NavigationMenuPrimitive.List.Props) {
	return (
		<NavigationMenuPrimitive.List
			data-slot="navigation-menu-list"
			className={cn(
				"group flex flex-1 list-none items-center justify-center gap-1",
				className,
			)}
			{...props}
		/>
	);
}

function NavigationMenuItem({
	className,
	...props
}: NavigationMenuPrimitive.Item.Props) {
	return (
		<NavigationMenuPrimitive.Item
			data-slot="navigation-menu-item"
			className={cn("relative", className)}
			{...props}
		/>
	);
}

const navigationMenuTriggerStyle = cva(
	"group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-accent/50 data-popup-open:text-accent-foreground focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1",
);

function NavigationMenuTrigger({
	className,
	children,
	render,
	...props
}: NavigationMenuPrimitive.Trigger.Props) {
	return (
		<NavigationMenuPrimitive.Trigger
			data-slot="navigation-menu-trigger"
			className={cn(navigationMenuTriggerStyle(), className)}
			render={render}
			// A `render` target that isn't a real <button> (e.g. a Next.js Link)
			// must drop native button semantics, or Base UI warns.
			nativeButton={rendersNativeButton(render)}
			{...props}
		>
			{children}{" "}
			<ChevronDownIcon
				className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180"
				aria-hidden="true"
			/>
		</NavigationMenuPrimitive.Trigger>
	);
}

function NavigationMenuContent({
	className,
	...props
}: NavigationMenuPrimitive.Content.Props) {
	return (
		<NavigationMenuPrimitive.Content
			data-slot="navigation-menu-content"
			className={cn(
				"w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out md:w-auto",
				className,
			)}
			{...props}
		/>
	);
}

/**
 * The shared popup surface is intentionally transparent and non-clipping: the
 * visible panel styling (background, border, radius, shadow) is carried by each
 * `NavigationMenuContent`, and overflow is left visible so bespoke flyouts can
 * escape the popup bounds.
 */
function NavigationMenuViewport({
	className,
	side = "bottom",
	sideOffset = 6,
	align = "start",
	alignOffset = 0,
	...props
}: NavigationMenuPrimitive.Positioner.Props) {
	return (
		<NavigationMenuPrimitive.Portal>
			<NavigationMenuPrimitive.Positioner
				data-slot="navigation-menu-positioner"
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
				className={cn("isolate z-50 max-w-(--available-width)", className)}
				{...props}
			>
				<NavigationMenuPrimitive.Popup className="relative origin-(--transform-origin) outline-none">
					<NavigationMenuPrimitive.Viewport
						data-slot="navigation-menu-viewport"
						className="relative"
					/>
				</NavigationMenuPrimitive.Popup>
			</NavigationMenuPrimitive.Positioner>
		</NavigationMenuPrimitive.Portal>
	);
}

function NavigationMenuLink({
	className,
	...props
}: NavigationMenuPrimitive.Link.Props) {
	return (
		<NavigationMenuPrimitive.Link
			data-slot="navigation-menu-link"
			className={cn(
				"data-active:bg-accent/50 data-active:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		/>
	);
}

export {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
	NavigationMenuViewport,
};
