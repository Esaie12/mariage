import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CeremoniesService } from './ceremonies.service';
import { CreateCeremonyDto } from './dto/create-ceremony.dto';
import { UpdateCeremonyDto } from './dto/update-ceremony.dto';

@Controller('ceremonies')
export class CeremoniesController {
  constructor(private readonly ceremoniesService: CeremoniesService) {}

  @Post()
  create(@Body() createCeremonyDto: CreateCeremonyDto) {
    return this.ceremoniesService.create(createCeremonyDto);
  }

  @Get()
  findAll() {
    return this.ceremoniesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ceremoniesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCeremonyDto: UpdateCeremonyDto,
  ) {
    return this.ceremoniesService.update(id, updateCeremonyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ceremoniesService.remove(id);
  }
}
