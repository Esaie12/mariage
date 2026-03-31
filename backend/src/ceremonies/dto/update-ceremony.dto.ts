import { CreateCeremonyDto } from './create-ceremony.dto';

export class UpdateCeremonyDto implements Partial<CreateCeremonyDto> {
  title?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  guestCount?: number;
}
