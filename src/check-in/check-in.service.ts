import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GuestStatus } from '../common/enums/guest-status.enum';
import { GuestsService } from '../guests/guests.service';
import { CheckInDto } from './dto/check-in.dto';

@Injectable()
export class CheckInService {
  constructor(private readonly guestsService: GuestsService) {}

  checkIn(checkInDto: CheckInDto) {
    if (!checkInDto.uid?.trim()) {
      throw new BadRequestException('uid est obligatoire');
    }

    const guest = this.guestsService.findByUid(checkInDto.uid);

    if (!guest) {
      throw new NotFoundException('Invité introuvable');
    }

    if (guest.status === GuestStatus.PRESENT) {
      throw new BadRequestException('Code déjà utilisé / UID non valide');
    }

    guest.status = GuestStatus.PRESENT;
    guest.arrivalTime = new Date();
    if (checkInDto.remarks !== undefined) {
      guest.remarks = checkInDto.remarks;
    }

    return this.guestsService.save(guest);
  }
}
