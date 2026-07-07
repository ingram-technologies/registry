// @vitest-environment happy-dom
import { fireEvent, render, screen } from "@testing-library/react";
import { Activity } from "lucide-react";
import { describe, expect, it } from "vitest";

import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./card";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./dropdown-menu";
import { EmptyState } from "./empty-state";
import { Input } from "./input";
import { Label } from "./label";
import { PageHeader } from "./page-header";
import { Select, SelectTrigger, SelectValue } from "./select";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import { compactNumber, StatCard } from "./stat-card";
import { StatusBadge } from "./status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Textarea } from "./textarea";

describe("primitives render with the shared vocabulary", () => {
	it("button applies variant + size classes and supports asChild", () => {
		render(
			<Button variant="destructive" size="sm">
				Delete
			</Button>,
		);
		const btn = screen.getByRole("button", { name: "Delete" });
		expect(btn.className).toContain("bg-destructive");
		expect(btn.className).toContain("h-9");

		render(
			<Button asChild>
				<a href="/somewhere">Go</a>
			</Button>,
		);
		// Base UI keeps button semantics (role="button") on the rendered element.
		const link = screen.getByText("Go");
		expect(link.tagName).toBe("A");
		expect(link.getAttribute("href")).toBe("/somewhere");
		expect(link.className).toContain("bg-primary");
	});

	it("badge renders its variants", () => {
		render(<Badge variant="outline">beta</Badge>);
		expect(screen.getByText("beta").className).toContain("text-foreground");
	});

	it("card composes header/action/content", () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Usage</CardTitle>
					<CardDescription>Last 30 days</CardDescription>
					<CardAction>
						<Button size="sm">Export</Button>
					</CardAction>
				</CardHeader>
				<CardContent>42 runs</CardContent>
			</Card>,
		);
		expect(screen.getByText("Usage")).toBeTruthy();
		expect(screen.getByText("42 runs")).toBeTruthy();
	});

	it("form controls share the field styling", () => {
		render(
			<div>
				<Label htmlFor="name">Name</Label>
				<Input id="name" placeholder="Ada" />
				<Textarea placeholder="Notes" />
			</div>,
		);
		expect(screen.getByPlaceholderText("Ada").className).toContain("border-input");
		expect(screen.getByPlaceholderText("Notes").className).toContain(
			"border-input",
		);
		expect(screen.getByText("Name").tagName).toBe("LABEL");
	});

	it("select trigger renders with placeholder styling hooks", () => {
		render(
			<Select>
				<SelectTrigger aria-label="Role">
					<SelectValue placeholder="Pick a role" />
				</SelectTrigger>
			</Select>,
		);
		expect(screen.getByLabelText("Role")).toBeTruthy();
	});

	it("dialog opens from its trigger", () => {
		render(
			<Dialog>
				<DialogTrigger>Open settings</DialogTrigger>
				<DialogContent>
					<DialogTitle>Settings</DialogTitle>
				</DialogContent>
			</Dialog>,
		);
		expect(screen.queryByText("Settings")).toBeNull();
		fireEvent.click(screen.getByText("Open settings"));
		expect(screen.getByText("Settings")).toBeTruthy();
	});

	it("dropdown menu opens from its trigger", () => {
		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Account</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Sign out</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);
		expect(screen.queryByText("Sign out")).toBeNull();
		fireEvent.click(screen.getByText("Account"));
		expect(screen.getByText("Sign out")).toBeTruthy();
	});

	it("tabs select the default tab and show its panel", () => {
		render(
			<Tabs defaultValue="members">
				<TabsList>
					<TabsTrigger value="members">Members</TabsTrigger>
					<TabsTrigger value="invitations">Invitations</TabsTrigger>
				</TabsList>
				<TabsContent value="members">Member list</TabsContent>
				<TabsContent value="invitations">Invitation list</TabsContent>
			</Tabs>,
		);
		expect(screen.getByText("Member list")).toBeTruthy();
		expect(screen.queryByText("Invitation list")).toBeNull();
	});

	it("avatar falls back to initials", () => {
		render(
			<Avatar>
				<AvatarFallback>JL</AvatarFallback>
			</Avatar>,
		);
		expect(screen.getByText("JL")).toBeTruthy();
	});

	it("separator, skeleton and table render", () => {
		render(
			<div>
				<Separator />
				<Skeleton data-testid="skeleton" />
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>Widgets Inc</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>,
		);
		expect(screen.getByTestId("skeleton").className).toContain("animate-pulse");
		expect(screen.getByText("Widgets Inc").tagName).toBe("TD");
	});
});

describe("dashboard patterns", () => {
	it("page header lays out title, description, and actions", () => {
		render(
			<PageHeader
				title="Domains"
				description="Everything registered under this workspace"
				icon={Activity}
				actions={<Button size="sm">Add domain</Button>}
			/>,
		);
		expect(screen.getByRole("heading", { name: "Domains" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Add domain" })).toBeTruthy();
	});

	it("empty state carries icon, copy, and action", () => {
		render(
			<EmptyState
				icon={Activity}
				title="No activity yet"
				description="Actions taken in this workspace show up here."
				action={<Button>Invite a teammate</Button>}
			/>,
		);
		expect(screen.getByText("No activity yet")).toBeTruthy();
		expect(screen.getByRole("button", { name: "Invite a teammate" })).toBeTruthy();
	});

	it("stat card formats compact values", () => {
		render(<StatCard icon={Activity} label="Runs" value={compactNumber(12_400)} />);
		expect(screen.getByText("12.4k")).toBeTruthy();
		expect(compactNumber(3_400_000)).toBe("3.4M");
		expect(compactNumber(42)).toBe("42");
	});

	it("status badge maps statuses to tones and humanizes labels", () => {
		render(
			<div>
				<StatusBadge status="succeeded" />
				<StatusBadge status="in_progress" />
				<StatusBadge status={null} />
			</div>,
		);
		expect(screen.getByText("succeeded").className).toContain("emerald");
		expect(screen.getByText("in progress").className).toContain("blue");
		expect(screen.getByText("unknown").className).toContain("bg-muted");
	});

	it("delete confirm dialog only arms once the name is typed verbatim", () => {
		render(
			<DeleteConfirmDialog
				title="Delete organization"
				confirmText="widgets-inc"
				confirmLabel="Delete organization"
				description="This permanently deletes the organization."
				onClose={() => {}}
				onConfirm={async () => null}
			/>,
		);
		const confirm = screen.getByRole("button", { name: /Delete organization/ });
		expect((confirm as HTMLButtonElement).disabled).toBe(true);
		fireEvent.change(screen.getByPlaceholderText("widgets-inc"), {
			target: { value: "widgets-inc" },
		});
		expect((confirm as HTMLButtonElement).disabled).toBe(false);
	});
});
