export const CACHE_TAGS = {
	// Note 更新時のキャッシュ無効化用タグ
	// note(roomId) が更新されたら、このタグのキャッシュを無効化
	note: (roomId: string) => `note-${roomId}`,

	// Poker 設定更新時のキャッシュ無効化用タグ
	// poker(roomId) が更新されたら、このタグのキャッシュを無効化
	poker: (roomId: string) => `poker-${roomId}`,

	// RoomInformation 更新時のキャッシュ無効化用タグ
	// roomInfo(roomId) が更新されたら、このタグのキャッシュを無効化
	roomInfo: (roomId: string) => `room-info-${roomId}`,
} as const;
