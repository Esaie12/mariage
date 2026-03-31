import { Injectable } from '@nestjs/common';
import { Ceremony } from './ceremonies/ceremony.entity';
import { Guest } from './guests/guest.entity';

@Injectable()
export class DataStoreService {
  ceremonies: Ceremony[] = [];
  guests: Guest[] = [];
  ceremonyIdSeq = 1;
  guestIdSeq = 1;
}
