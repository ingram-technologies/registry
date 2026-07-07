"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

function SelectTrigger({
	className,
	children,
	...props
}: SelectPrimitive.Trigger.Props) {
	return (
		<SelectPrimitive.Trigger
			data-slot="select-trigger"
			className={cn(
				"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
				className,
			)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon
				render={<ChevronDown className="h-4 w-4 opacity-50" />}
			/>
		</SelectPrimitive.Trigger>
	);
}

function SelectScrollUpButton({
	className,
	...props
}: SelectPrimitive.ScrollUpArrow.Props) {
	return (
		<SelectPrimitive.ScrollUpArrow
			className={cn(
				"flex cursor-default items-center justify-center py-1",
				className,
			)}
			{...props}
		>
			<ChevronUp className="h-4 w-4" />
		</SelectPrimitive.ScrollUpArrow>
	);
}

function SelectScrollDownButton({
	className,
	...props
}: SelectPrimitive.ScrollDownArrow.Props) {
	return (
		<SelectPrimitive.ScrollDownArrow
			className={cn(
				"flex cursor-default items-center justify-center py-1",
				className,
			)}
			{...props}
		>
			<ChevronDown className="h-4 w-4" />
		</SelectPrimitive.ScrollDownArrow>
	);
}

function SelectContent({ className, children, ...props }: SelectPrimitive.Popup.Props) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner
				className="z-50"
				sideOffset={4}
				alignItemWithTrigger={false}
			>
				<SelectPrimitive.Popup
					data-slot="select-content"
					className={cn(
						"relative z-50 max-h-[min(24rem,var(--available-height))] min-w-[8rem] w-[var(--anchor-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95",
						className,
					)}
					{...props}
				>
					<SelectScrollUpButton />
					<SelectPrimitive.List className="p-1">
						{children}
					</SelectPrimitive.List>
					<SelectScrollDownButton />
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	);
}

function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
	return (
		<SelectPrimitive.GroupLabel
			className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
			{...props}
		/>
	);
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
	return (
		<SelectPrimitive.Item
			data-slot="select-item"
			className={cn(
				"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
				className,
			)}
			{...props}
		>
			<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
				<SelectPrimitive.ItemIndicator>
					<Check className="h-4 w-4" />
				</SelectPrimitive.ItemIndicator>
			</span>

			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
	return (
		<SelectPrimitive.Separator
			className={cn("-mx-1 my-1 h-px bg-muted", className)}
			{...props}
		/>
	);
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
