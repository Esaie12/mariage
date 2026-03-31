import { Module } from '@nestjs/common';
import { CeremoniesModule } from './ceremonies/ceremonies.module';
import { CheckInModule } from './check-in/check-in.module';
import { DocsController } from './docs.controller';
import { GuestsModule } from './guests/guests.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, CeremoniesModule, GuestsModule, CheckInModule],
  controllers: [DocsController],
})
export class AppModule {}
