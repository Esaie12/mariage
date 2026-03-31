import { GuestStatus } from '../common/enums/guest-status.enum';
import { GuestType } from '../common/enums/guest-type.enum';

export class Guest {
  id: number;
  name: string;
  type: GuestType;
  seatCount: number;
  uid: string;
  ceremonyId: number;
  status: GuestStatus;
  arrivalTime: Date | null;
  remarks: string | null;
}
