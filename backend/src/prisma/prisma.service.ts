import { Injectable } from '@nestjs/common';
import { Ceremony } from '../ceremonies/ceremony.entity';
import { Guest } from '../guests/guest.entity';

@Injectable()
export class PrismaService {
  private ceremonies: Ceremony[] = [];
  private guests: Guest[] = [];
  private ceremonyIdSeq = 1;
  private guestIdSeq = 1;

  ceremony = {
    create: ({ data }: { data: Omit<Ceremony, 'id'> }) => {
      const ceremony: Ceremony = { id: this.ceremonyIdSeq++, ...data };
      this.ceremonies.push(ceremony);
      return ceremony;
    },
    findMany: () => this.ceremonies,
    findUnique: ({ where: { id } }: { where: { id: number } }) =>
      this.ceremonies.find((item) => item.id === id) ?? null,
    update: ({
      where: { id },
      data,
    }: {
      where: { id: number };
      data: Partial<Omit<Ceremony, 'id'>>;
    }) => {
      const ceremony = this.ceremonies.find((item) => item.id === id)!;
      Object.assign(ceremony, data);
      return ceremony;
    },
    delete: ({ where: { id } }: { where: { id: number } }) => {
      const ceremony = this.ceremonies.find((item) => item.id === id)!;
      this.ceremonies = this.ceremonies.filter((item) => item.id !== id);
      this.guests = this.guests.filter((guest) => guest.ceremonyId !== id);
      return ceremony;
    },
  };

  guest = {
    create: ({ data }: { data: Omit<Guest, 'id'> }) => {
      const guest: Guest = { id: this.guestIdSeq++, ...data };
      this.guests.push(guest);
      return guest;
    },
    findMany: () => this.guests,
    findUnique: ({ where }: { where: { id?: number; uid?: string } }) => {
      if (where.id !== undefined) {
        return this.guests.find((item) => item.id === where.id) ?? null;
      }
      if (where.uid !== undefined) {
        return this.guests.find((item) => item.uid === where.uid) ?? null;
      }
      return null;
    },
    update: ({
      where: { id },
      data,
    }: {
      where: { id: number };
      data: Partial<Omit<Guest, 'id'>>;
    }) => {
      const guest = this.guests.find((item) => item.id === id)!;
      Object.assign(guest, data);
      return guest;
    },
    delete: ({ where: { id } }: { where: { id: number } }) => {
      const guest = this.guests.find((item) => item.id === id)!;
      this.guests = this.guests.filter((item) => item.id !== id);
      return guest;
    },
  };
}
