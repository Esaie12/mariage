export interface Ceremony {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  guestCount: number;
}

export type GuestType = 'Homme' | 'Femme' | 'Famille' | 'Groupe';
export type GuestStatus = 'PENDING' | 'PRESENT';

export interface Guest {
  id: number;
  name: string;
  type: GuestType;
  seatCount: number;
  uid: string;
  ceremonyId: number;
  status: GuestStatus;
  arrivalTime: string | null;
  remarks: string | null;
}

export interface CheckInPayload {
  uid: string;
  remarks?: string;
}
