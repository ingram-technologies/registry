/**
 * Repo-local mirror of the `cn` helper every consuming app already has (from
 * `shadcn init`). It exists so `@/lib/utils` imports in `registry/ui/*`
 * type-check inside this repo; it is not itself a registry item — consumers
 * use their own `lib/utils.ts`.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
