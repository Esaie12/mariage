import { Module } from '@nestjs/common';
import { CeremoniesModule } from './ceremonies/ceremonies.module';
import { CheckInModule } from './check-in/check-in.module';
import { DataStoreModule } from './data-store.module';
import { DocsController } from './docs.controller';
import { GuestsModule } from './guests/guests.module';

@Module({
  imports: [DataStoreModule, CeremoniesModule, GuestsModule, CheckInModule],
  controllers: [DocsController],
})
export class AppModule {}
