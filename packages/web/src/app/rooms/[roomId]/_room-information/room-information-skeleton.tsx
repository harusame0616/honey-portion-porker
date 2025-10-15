import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "../section";

export function RoomInformationSkeleton() {
	const memberRoomIdInputId = useId();
	const memberRoomUrlInputId = useId();

	return (
		<Section className="flex flex-col gap-2" title="Room information">
			<div>
				<label className="text-sm" htmlFor={memberRoomIdInputId}>
					Member Room ID
				</label>
				<div className="flex">
					<div className="relative max-w-80 w-full">
						<Input
							className="w-full"
							disabled
							id={memberRoomIdInputId}
							name="roomId"
							readOnly
							value=""
						/>
						<Skeleton className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-5 rounded-md" />
					</div>
				</div>
			</div>
			<div>
				<label className="text-sm" htmlFor={memberRoomUrlInputId}>
					Member Room URL
				</label>
				<div className="flex">
					<div className="relative max-w-[605px] w-full">
						<Input
							className="w-full"
							disabled
							id={memberRoomUrlInputId}
							name="roomId"
							readOnly
							value=""
						/>
						<Skeleton className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-5 rounded-md" />
					</div>
				</div>
			</div>
		</Section>
	);
}
