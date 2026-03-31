import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GuestStatus } from '../common/enums/guest-status.enum';
import { PrismaService } from '../prisma/prisma.service';
import { Guest } from './guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createGuestDto: CreateGuestDto) {
    const ceremony = this.prisma.ceremony.findUnique({
      where: { id: createGuestDto.ceremonyId },
    });
    if (!ceremony) {
      throw new NotFoundException('Cérémonie introuvable');
    }

    const existing = this.prisma.guest.findUnique({
      where: { uid: createGuestDto.uid },
    });
    if (existing) {
      throw new ConflictException('UID déjà utilisé');
    }

    return this.prisma.guest.create({
      data: {
        ...createGuestDto,
        status: GuestStatus.PENDING,
        arrivalTime: null,
        remarks: createGuestDto.remarks ?? null,
      },
    });
  }

  findAll() {
    return this.prisma.guest.findMany();
  }

  findOne(id: number) {
    const guest = this.prisma.guest.findUnique({ where: { id } });
    if (!guest) {
      throw new NotFoundException('Invité introuvable');
    }
    return guest;
  }

  update(id: number, updateGuestDto: UpdateGuestDto) {
    const guest = this.findOne(id);

    if (updateGuestDto.uid && updateGuestDto.uid !== guest.uid) {
      const existing = this.prisma.guest.findUnique({
        where: { uid: updateGuestDto.uid },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('UID déjà utilisé');
      }
    }

    if (updateGuestDto.ceremonyId) {
      const ceremony = this.prisma.ceremony.findUnique({
        where: { id: updateGuestDto.ceremonyId },
      });
      if (!ceremony) {
        throw new NotFoundException('Cérémonie introuvable');
      }
    }

    return this.prisma.guest.update({ where: { id }, data: updateGuestDto });
  }

  remove(id: number) {
    this.findOne(id);
    this.prisma.guest.delete({ where: { id } });
    return { message: 'Invité supprimé' };
  }

  findByUid(uid: string) {
    return this.prisma.guest.findUnique({ where: { uid } });
  }

  save(guest: Guest) {
    return this.prisma.guest.update({ where: { id: guest.id }, data: guest });
  }
}
