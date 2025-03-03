import { useState } from "react";

type User = { card: number; userId: string };
type UseUsers = {
	users: User[];
	setUsers: (users: User[]) => void;
	selectedUsers: User[];
	selectedCard: number | undefined;
};

export function useUsers(myUserId: string): UseUsers {
	const [users, setUsers] = useState<User[]>([]);

	const selectedCard = users.find((user) => user.userId === myUserId)?.card;
	const selectedUsers = users.filter((user) => user.card !== undefined);

	return {
		users,
		setUsers,
		selectedCard,
		selectedUsers,
	};
}
