import { Module } from '@nestjs/common';
import { GuestsModule } from '../guests/guests.module';
import { CheckInController } from './check-in.controller';
import { CheckInService } from './check-in.service';

@Module({
  imports: [GuestsModule],
  controllers: [CheckInController],
  providers: [CheckInService],
})
export class CheckInModule {}
