"use client";

import { Badge } from "@interior-design-ai/ui/components/badge";
import { Button } from "@interior-design-ai/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@interior-design-ai/ui/components/dialog";
import { Input } from "@interior-design-ai/ui/components/input";
import { Label } from "@interior-design-ai/ui/components/label";
import { Select } from "@interior-design-ai/ui/components/select";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";

const ROOM_TYPES = [
	{ value: "LIVING_ROOM", label: "Living Room" },
	{ value: "BEDROOM", label: "Bedroom" },
	{ value: "MASTER_BEDROOM", label: "Master Bedroom" },
	{ value: "CHILDREN_ROOM", label: "Children's Room" },
	{ value: "BATHROOM", label: "Bathroom" },
	{ value: "KITCHEN", label: "Kitchen" },
	{ value: "DINING_ROOM", label: "Dining Room" },
	{ value: "HOME_OFFICE", label: "Home Office" },
	{ value: "HALLWAY", label: "Hallway" },
	{ value: "BALCONY", label: "Balcony" },
	{ value: "GARAGE", label: "Garage" },
	{ value: "OTHER", label: "Other" },
];

interface Room {
	id: string;
	name: string;
	roomType: string;
}

interface RoomManagerProps {
	houseId: string;
}

export function RoomManager({ houseId }: RoomManagerProps) {
	const [rooms, setRooms] = useState<Room[]>([]);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [newName, setNewName] = useState("");
	const [newType, setNewType] = useState("LIVING_ROOM");

	const fetchRooms = useCallback(async () => {
		const data = await api.get<{ rooms: Room[] }>(`/houses/${houseId}/rooms`);
		setRooms(data.rooms);
	}, [houseId]);

	useEffect(() => {
		fetchRooms();
	}, [fetchRooms]);

	const addRoom = async () => {
		await api.post(`/houses/${houseId}/rooms`, {
			name: newName,
			roomType: newType,
		});
		setDialogOpen(false);
		setNewName("");
		setNewType("LIVING_ROOM");
		fetchRooms();
	};

	const deleteRoom = async (roomId: string) => {
		await api.delete(`/houses/${houseId}/rooms/${roomId}`);
		fetchRooms();
	};

	return (
		<div className="border border-ef-border bg-ef-bg-surface p-4">
			<div className="mb-3 flex items-center justify-between">
				<h3 className="font-medium text-[10px] text-ef-gold uppercase tracking-widest">
					Rooms
				</h3>
				<button
					type="button"
					onClick={() => setDialogOpen(true)}
					className="flex items-center gap-1 text-[10px] text-ef-accent uppercase tracking-widest transition-colors hover:text-ef-accent/80"
				>
					<Plus className="size-3" />
					Add
				</button>
			</div>

			{rooms.length === 0 ? (
				<p className="py-4 text-center text-[10px] text-ef-text-secondary">
					No rooms configured. House DNA applies globally.
				</p>
			) : (
				<div className="flex flex-col gap-2">
					{rooms.map((room) => (
						<div
							key={room.id}
							className="flex items-center justify-between border border-ef-border px-3 py-2"
						>
							<div className="flex items-center gap-2">
								<span className="text-ef-text-primary text-xs">
									{room.name}
								</span>
								<Badge variant="default">
									{room.roomType.replace(/_/g, " ")}
								</Badge>
							</div>
							<button
								type="button"
								onClick={() => deleteRoom(room.id)}
								className="text-ef-text-secondary transition-colors hover:text-destructive"
							>
								<Trash2 className="size-3" />
							</button>
						</div>
					))}
				</div>
			)}

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogHeader>
					<DialogTitle>Add Room</DialogTitle>
					<DialogClose onClick={() => setDialogOpen(false)} />
				</DialogHeader>
				<DialogContent>
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1.5">
							<Label className="text-[10px] text-ef-text-secondary uppercase tracking-widest">
								Room Name
							</Label>
							<Input
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
								placeholder="e.g. Master Suite"
								className="border-ef-border bg-ef-bg-deep text-ef-text-primary"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label className="text-[10px] text-ef-text-secondary uppercase tracking-widest">
								Room Type
							</Label>
							<Select
								options={ROOM_TYPES}
								value={newType}
								onChange={(e) => setNewType(e.target.value)}
								className="border-ef-border bg-ef-bg-deep text-ef-text-primary"
							/>
						</div>
					</div>
				</DialogContent>
				<DialogFooter>
					<Button
						variant="ghost"
						onClick={() => setDialogOpen(false)}
						className="text-ef-text-secondary"
					>
						Cancel
					</Button>
					<Button
						onClick={addRoom}
						disabled={!newName.trim()}
						className="bg-ef-accent text-ef-bg-deep hover:bg-ef-accent/90"
					>
						Add Room
					</Button>
				</DialogFooter>
			</Dialog>
		</div>
	);
}
