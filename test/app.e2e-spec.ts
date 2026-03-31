import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

type OpenApiDoc = {
  paths: Record<string, unknown>;
};

type CeremonyResponse = { id: number };
type GuestResponse = { id: number; uid: string };

describe('Wedding API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api-json (GET)', () => {
    return request(app.getHttpServer())
      .get('/api-json')
      .expect(200)
      .expect((res: { body: OpenApiDoc }) => {
        expect(res.body.paths['/check-in']).toBeDefined();
        expect(res.body.paths['/guests/import/{ceremonyId}']).toBeDefined();
      });
  });

  it('should auto-generate uid and block uid update', async () => {
    const ceremonyRes = await request(app.getHttpServer())
      .post('/ceremonies')
      .send({
        title: 'Mariage',
        date: '2026-08-10',
        startTime: '14:00',
        endTime: '23:00',
        location: 'Paris',
        guestCount: 100,
      });

    const ceremony = ceremonyRes.body as CeremonyResponse;

    const guestRes = await request(app.getHttpServer()).post('/guests').send({
      name: 'MOUSSA DIABI',
      type: 'Homme',
      seatCount: 1,
      ceremonyId: ceremony.id,
    });

    const guest = guestRes.body as GuestResponse;

    expect(guestRes.status).toBe(201);
    expect(guest.uid).toBeDefined();
    expect(guest.uid).not.toBe('ABC123');

    await request(app.getHttpServer())
      .patch(`/guests/${guest.id}`)
      .send({ uid: 'HACKEDUID' })
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
