import { Body, Controller, Post } from '@nestjs/common';
import { CheckInDto } from './dto/check-in.dto';
import { CheckInService } from './check-in.service';

@Controller('check-in')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Post()
  checkIn(@Body() checkInDto: CheckInDto) {
    return this.checkInService.checkIn(checkInDto);
  }
}
