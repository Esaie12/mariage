import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

type OpenApiDoc = {
  paths: Record<string, unknown>;
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

  it('/api-json (GET)', () => {
    return request(app.getHttpServer())
      .get('/api-json')
      .expect(200)
      .expect((res: { body: OpenApiDoc }) => {
        expect(res.body.paths['/check-in']).toBeDefined();
      });
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('SwaggerUIBundle');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
