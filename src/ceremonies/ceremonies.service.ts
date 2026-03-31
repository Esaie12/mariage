import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCeremonyDto } from './dto/create-ceremony.dto';
import { UpdateCeremonyDto } from './dto/update-ceremony.dto';

@Injectable()
export class CeremoniesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCeremonyDto: CreateCeremonyDto) {
    return this.prisma.ceremony.create({ data: createCeremonyDto });
  }

  findAll() {
    return this.prisma.ceremony.findMany();
  }

  findOne(id: number) {
    const ceremony = this.prisma.ceremony.findUnique({ where: { id } });
    if (!ceremony) {
      throw new NotFoundException('Cérémonie introuvable');
    }

    return ceremony;
  }

  update(id: number, updateCeremonyDto: UpdateCeremonyDto) {
    this.findOne(id);
    return this.prisma.ceremony.update({
      where: { id },
      data: updateCeremonyDto,
    });
  }

  remove(id: number) {
    this.findOne(id);
    this.prisma.ceremony.delete({ where: { id } });
    return { message: 'Cérémonie supprimée' };
  }
}
