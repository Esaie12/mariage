import { Module } from '@nestjs/common';
import { CeremoniesController } from './ceremonies.controller';
import { CeremoniesService } from './ceremonies.service';

@Module({
  controllers: [CeremoniesController],
  providers: [CeremoniesService],
  exports: [CeremoniesService],
})
export class CeremoniesModule {}
