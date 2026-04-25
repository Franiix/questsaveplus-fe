export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface FriendshipEntity {
 id: string;
 requester_id: string;
 recipient_id: string;
 status: FriendshipStatus;
 created_at: string;
 accepted_at: string | null;
}
