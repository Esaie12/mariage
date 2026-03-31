import { Module } from '@nestjs/common';
import { CeremoniesModule } from './ceremonies/ceremonies.module';
import { CheckInModule } from './check-in/check-in.module';
import { GuestsModule } from './guests/guests.module';
import { PrismaModule } from './prisma/prisma.module';
import { SwaggerController } from './swagger.controller';

@Module({
  imports: [PrismaModule, CeremoniesModule, GuestsModule, CheckInModule],
  controllers: [SwaggerController],
})
export class AppModule {}
