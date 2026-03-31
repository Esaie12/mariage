import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class SwaggerController {
  @Get('api-json')
  getOpenApiDocument() {
    return {
      openapi: '3.0.0',
      info: {
        title: 'API Gestion de présence des invités',
        version: '1.0.0',
        description:
          'Documentation Swagger pour ceremonies, guests et check-in',
      },
      paths: {
        '/ceremonies': {
          get: { summary: 'Lister les cérémonies' },
          post: { summary: 'Créer une cérémonie' },
        },
        '/ceremonies/{id}': {
          get: { summary: 'Récupérer une cérémonie' },
          patch: { summary: 'Mettre à jour une cérémonie' },
          delete: { summary: 'Supprimer une cérémonie' },
        },
        '/guests': {
          get: { summary: 'Lister les invités' },
          post: { summary: 'Créer un invité' },
        },
        '/guests/{id}': {
          get: { summary: 'Récupérer un invité' },
          patch: { summary: 'Mettre à jour un invité' },
          delete: { summary: 'Supprimer un invité' },
        },
        '/check-in': {
          post: { summary: 'Check-in via UID' },
        },
      },
      components: {
        schemas: {
          CheckInDto: {
            type: 'object',
            properties: {
              uid: { type: 'string' },
              remarks: { type: 'string', nullable: true },
            },
            required: ['uid'],
          },
        },
      },
    };
  }

  @Get('api')
  getSwaggerUi(@Res() res: Response) {
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/api-json',
        dom_id: '#swagger-ui',
      });
    </script>
  </body>
</html>`;

    return res.type('text/html').send(html);
  }
}
