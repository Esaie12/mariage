import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

type ApiDocsResponse = {
  endpoints: {
    checkIn: string[];
  };
};

describe('Wedding API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect((res: { body: ApiDocsResponse }) => {
        expect(res.body.endpoints.checkIn).toContain('POST /check-in');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
