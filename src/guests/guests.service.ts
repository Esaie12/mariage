import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { GuestStatus } from '../common/enums/guest-status.enum';
import { GuestType } from '../common/enums/guest-type.enum';
import { PrismaService } from '../prisma/prisma.service';
import { Guest } from './guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateUid() {
    return randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase();
  }

  private generateUniqueUid() {
    let uid = this.generateUid();
    while (this.prisma.guest.findUnique({ where: { uid } })) {
      uid = this.generateUid();
    }
    return uid;
  }

  create(createGuestDto: CreateGuestDto) {
    if ('uid' in (createGuestDto as unknown as Record<string, unknown>)) {
      throw new BadRequestException('Le UID est généré automatiquement');
    }
    const ceremony = this.prisma.ceremony.findUnique({
      where: { id: createGuestDto.ceremonyId },
    });
    if (!ceremony) {
      throw new NotFoundException('Cérémonie introuvable');
    }

    return this.prisma.guest.create({
      data: {
        ...createGuestDto,
        uid: this.generateUniqueUid(),
        status: GuestStatus.PENDING,
        arrivalTime: null,
        remarks: createGuestDto.remarks ?? null,
      },
    });
  }

  importFromCsv(ceremonyId: number, csvBuffer: Buffer) {
    const ceremony = this.prisma.ceremony.findUnique({
      where: { id: ceremonyId },
    });
    if (!ceremony) {
      throw new NotFoundException('Cérémonie introuvable');
    }

    const content = csvBuffer.toString('utf-8').trim();
    if (!content) {
      throw new BadRequestException('Fichier vide');
    }

    const lines = content.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length < 2) {
      throw new BadRequestException(
        'Le fichier doit contenir un header et des lignes',
      );
    }

    const delimiter = lines[0].includes(';') ? ';' : ',';
    const headers = lines[0]
      .split(delimiter)
      .map((header) => header.trim().toLowerCase());

    const expectedHeaders = ['nom', 'type', 'nombre de place'];
    const hasHeaders = expectedHeaders.every((header) =>
      headers.includes(header),
    );
    if (!hasHeaders) {
      throw new BadRequestException(
        'Format invalide. Colonnes attendues: nom, type, nombre de place',
      );
    }

    const nameIndex = headers.indexOf('nom');
    const typeIndex = headers.indexOf('type');
    const seatCountIndex = headers.indexOf('nombre de place');

    const createdGuests: Guest[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(delimiter).map((col) => col.trim());
      const name = cols[nameIndex];
      const type = cols[typeIndex] as GuestType;
      const seatCount = Number(cols[seatCountIndex]);

      if (!name || !type || Number.isNaN(seatCount) || seatCount <= 0) {
        throw new BadRequestException(`Ligne ${i + 1} invalide`);
      }

      if (!Object.values(GuestType).includes(type)) {
        throw new BadRequestException(
          `Ligne ${i + 1}: type invalide (Homme, Femme, Famille, Groupe)`,
        );
      }

      const guest = this.prisma.guest.create({
        data: {
          name,
          type,
          seatCount,
          ceremonyId,
          uid: this.generateUniqueUid(),
          status: GuestStatus.PENDING,
          arrivalTime: null,
          remarks: null,
        },
      });
      createdGuests.push(guest);
    }

    return {
      importedCount: createdGuests.length,
      guests: createdGuests,
    };
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
    this.findOne(id);

    if ('uid' in (updateGuestDto as unknown as Record<string, unknown>)) {
      throw new BadRequestException('Le UID ne peut pas être modifié');
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
