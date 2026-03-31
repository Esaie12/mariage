import { GuestType } from '../../common/enums/guest-type.enum';

export class CreateGuestDto {
  name: string;
  type: GuestType;
  seatCount: number;
  uid: string;
  ceremonyId: number;
  remarks?: string;
}
