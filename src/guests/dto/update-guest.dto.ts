import { CreateGuestDto } from './create-guest.dto';

export class UpdateGuestDto implements Partial<CreateGuestDto> {
  name?: string;
  type?: CreateGuestDto['type'];
  seatCount?: number;
  ceremonyId?: number;
  remarks?: string;
}
