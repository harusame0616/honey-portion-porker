import { createBrowserClient } from "@supabase/ssr";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { type MutableRefObject, useCallback, useMemo, useRef } from "react";

export type Channel = {
	ref: MutableRefObject<RealtimeChannel>;
	recreate: () => void;
};
export function useChannel(roomId: string): Channel {
	const channelRef = useRef(createChannel(roomId));

	const channel = useMemo(
		() => ({
			ref: channelRef,
			recreate: () => {
				channelRef.current = createChannel(roomId);
			},
		}),
		[roomId],
	);

	return channel;
}

function createChannel(roomId: string) {
	return createBrowserClient(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	).channel(roomId, { config: { broadcast: { self: true } } });
}
