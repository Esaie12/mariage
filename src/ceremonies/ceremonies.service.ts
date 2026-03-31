import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../data-store.service';
import { Ceremony } from './ceremony.entity';
import { CreateCeremonyDto } from './dto/create-ceremony.dto';
import { UpdateCeremonyDto } from './dto/update-ceremony.dto';

@Injectable()
export class CeremoniesService {
  constructor(private readonly store: DataStoreService) {}

  create(createCeremonyDto: CreateCeremonyDto) {
    const ceremony: Ceremony = {
      id: this.store.ceremonyIdSeq++,
      ...createCeremonyDto,
    };
    this.store.ceremonies.push(ceremony);
    return ceremony;
  }

  findAll() {
    return this.store.ceremonies;
  }

  findOne(id: number) {
    const ceremony = this.store.ceremonies.find((item) => item.id === id);
    if (!ceremony) {
      throw new NotFoundException('Cérémonie introuvable');
    }

    return ceremony;
  }

  update(id: number, updateCeremonyDto: UpdateCeremonyDto) {
    const ceremony = this.findOne(id);
    Object.assign(ceremony, updateCeremonyDto);
    return ceremony;
  }

  remove(id: number) {
    this.findOne(id);
    this.store.ceremonies = this.store.ceremonies.filter(
      (item) => item.id !== id,
    );
    this.store.guests = this.store.guests.filter(
      (guest) => guest.ceremonyId !== id,
    );
    return { message: 'Cérémonie supprimée' };
  }
}
