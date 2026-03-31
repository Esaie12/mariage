import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataStoreService } from '../data-store.service';
import { GuestStatus } from '../common/enums/guest-status.enum';
import { Guest } from './guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestsService {
  constructor(private readonly store: DataStoreService) {}

  create(createGuestDto: CreateGuestDto) {
    const ceremony = this.store.ceremonies.find(
      (item) => item.id === createGuestDto.ceremonyId,
    );
    if (!ceremony) {
      throw new NotFoundException('Cérémonie introuvable');
    }

    const existing = this.store.guests.find(
      (item) => item.uid === createGuestDto.uid,
    );
    if (existing) {
      throw new ConflictException('UID déjà utilisé');
    }

    const guest: Guest = {
      id: this.store.guestIdSeq++,
      ...createGuestDto,
      status: GuestStatus.PENDING,
      arrivalTime: null,
      remarks: createGuestDto.remarks ?? null,
    };
    this.store.guests.push(guest);
    return guest;
  }

  findAll() {
    return this.store.guests;
  }

  findOne(id: number) {
    const guest = this.store.guests.find((item) => item.id === id);
    if (!guest) {
      throw new NotFoundException('Invité introuvable');
    }
    return guest;
  }

  update(id: number, updateGuestDto: UpdateGuestDto) {
    const guest = this.findOne(id);

    if (updateGuestDto.uid && updateGuestDto.uid !== guest.uid) {
      const existing = this.store.guests.find(
        (item) => item.uid === updateGuestDto.uid && item.id !== id,
      );
      if (existing) {
        throw new ConflictException('UID déjà utilisé');
      }
    }

    if (updateGuestDto.ceremonyId) {
      const ceremony = this.store.ceremonies.find(
        (item) => item.id === updateGuestDto.ceremonyId,
      );
      if (!ceremony) {
        throw new NotFoundException('Cérémonie introuvable');
      }
    }

    Object.assign(guest, updateGuestDto);
    return guest;
  }

  remove(id: number) {
    this.findOne(id);
    this.store.guests = this.store.guests.filter((item) => item.id !== id);
    return { message: 'Invité supprimé' };
  }

  findByUid(uid: string) {
    return this.store.guests.find((item) => item.uid === uid) ?? null;
  }

  save(guest: Guest) {
    return guest;
  }
}
