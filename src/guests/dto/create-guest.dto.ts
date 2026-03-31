import { GuestType } from '../../common/enums/guest-type.enum';

export class CreateGuestDto {
  name: string;
  type: GuestType;
  seatCount: number;
  ceremonyId: number;
  remarks?: string;
}
