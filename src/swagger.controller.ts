import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class SwaggerController {
  @Get('api-json')
  getOpenApiDocument() {
    const ceremonySchema = {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        title: { type: 'string', example: 'Mariage civil' },
        date: { type: 'string', example: '2026-08-10' },
        startTime: { type: 'string', example: '14:00' },
        endTime: { type: 'string', example: '18:00' },
        location: { type: 'string', example: 'Mairie de Paris' },
        guestCount: { type: 'integer', example: 200 },
      },
    };

    const guestSchema = {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Mr et Mme HOUSSA' },
        type: {
          type: 'string',
          enum: ['Homme', 'Femme', 'Famille', 'Groupe'],
          example: 'Famille',
        },
        seatCount: { type: 'integer', example: 3 },
        uid: { type: 'string', example: 'ABC123' },
        ceremonyId: { type: 'integer', example: 1 },
        status: {
          type: 'string',
          enum: ['PENDING', 'PRESENT'],
          example: 'PENDING',
        },
        arrivalTime: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          example: '2026-08-10T14:12:00.000Z',
        },
        remarks: {
          type: 'string',
          nullable: true,
          example: 'Arrivé avec 2 enfants',
        },
      },
    };

    return {
      openapi: '3.0.0',
      info: {
        title: 'API Gestion de présence des invités',
        version: '1.0.0',
        description:
          'Documentation Swagger complète pour ceremonies, guests et check-in.',
      },
      tags: [
        { name: 'Ceremonies', description: 'Gestion des cérémonies' },
        { name: 'Guests', description: 'Gestion des invités' },
        { name: 'CheckIn', description: 'Validation de présence par UID' },
      ],
      paths: {
        '/ceremonies': {
          get: {
            tags: ['Ceremonies'],
            summary: 'Lister les cérémonies',
            responses: {
              '200': {
                description: 'Liste des cérémonies',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Ceremony' },
                    },
                  },
                },
              },
            },
          },
          post: {
            tags: ['Ceremonies'],
            summary: 'Créer une cérémonie',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CreateCeremonyDto' },
                  examples: {
                    exemple1: {
                      value: {
                        title: 'Réception de mariage',
                        date: '2026-08-10',
                        startTime: '14:00',
                        endTime: '23:00',
                        location: 'Palais des Congrès',
                        guestCount: 300,
                      },
                    },
                  },
                },
              },
            },
            responses: {
              '201': {
                description: 'Cérémonie créée',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Ceremony' },
                  },
                },
              },
            },
          },
        },
        '/ceremonies/{id}': {
          get: {
            tags: ['Ceremonies'],
            summary: 'Récupérer une cérémonie par id',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                example: 1,
              },
            ],
            responses: {
              '200': {
                description: 'Cérémonie trouvée',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Ceremony' },
                  },
                },
              },
              '404': { description: 'Cérémonie introuvable' },
            },
          },
          patch: {
            tags: ['Ceremonies'],
            summary: 'Mettre à jour une cérémonie',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                example: 1,
              },
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UpdateCeremonyDto' },
                  examples: {
                    exemple1: {
                      value: { location: 'Salle des Fêtes', guestCount: 350 },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Cérémonie mise à jour',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Ceremony' },
                  },
                },
              },
            },
          },
          delete: {
            tags: ['Ceremonies'],
            summary: 'Supprimer une cérémonie',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                example: 1,
              },
            ],
            responses: {
              '200': {
                description: 'Cérémonie supprimée',
                content: {
                  'application/json': {
                    examples: {
                      exemple1: { value: { message: 'Cérémonie supprimée' } },
                    },
                  },
                },
              },
            },
          },
        },
        '/guests': {
          get: {
            tags: ['Guests'],
            summary: 'Lister les invités',
            responses: {
              '200': {
                description: 'Liste des invités',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Guest' },
                    },
                  },
                },
              },
            },
          },
          post: {
            tags: ['Guests'],
            summary: 'Créer un invité',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CreateGuestDto' },
                  examples: {
                    famille: {
                      value: {
                        name: 'Mr et Mme HOUSSA',
                        type: 'Famille',
                        seatCount: 3,
                        uid: 'ABC123',
                        ceremonyId: 1,
                        remarks: 'VIP',
                      },
                    },
                  },
                },
              },
            },
            responses: {
              '201': {
                description: 'Invité créé',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Guest' },
                  },
                },
              },
              '409': { description: 'UID déjà utilisé' },
            },
          },
        },
        '/guests/{id}': {
          get: {
            tags: ['Guests'],
            summary: 'Récupérer un invité par id',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                example: 1,
              },
            ],
            responses: {
              '200': {
                description: 'Invité trouvé',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Guest' },
                  },
                },
              },
              '404': { description: 'Invité introuvable' },
            },
          },
          patch: {
            tags: ['Guests'],
            summary: 'Mettre à jour un invité',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                example: 1,
              },
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UpdateGuestDto' },
                  examples: {
                    exemple1: {
                      value: { seatCount: 4, remarks: 'Arrive tard' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Invité mis à jour',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Guest' },
                  },
                },
              },
            },
          },
          delete: {
            tags: ['Guests'],
            summary: 'Supprimer un invité',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                example: 1,
              },
            ],
            responses: {
              '200': {
                description: 'Invité supprimé',
                content: {
                  'application/json': {
                    examples: {
                      exemple1: { value: { message: 'Invité supprimé' } },
                    },
                  },
                },
              },
            },
          },
        },
        '/check-in': {
          post: {
            tags: ['CheckIn'],
            summary: 'Check-in sécurisé via UID',
            description:
              'Recherche invité par UID, bloque double scan, puis status=PRESENT + arrivalTime=now.',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CheckInDto' },
                  examples: {
                    scanSimple: { value: { uid: 'ABC123' } },
                    scanAvecRemarque: {
                      value: { uid: 'ABC123', remarks: 'Présent, table 5' },
                    },
                  },
                },
              },
            },
            responses: {
              '201': {
                description: 'Présence validée',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Guest' },
                  },
                },
              },
              '400': { description: 'Code déjà utilisé / UID non valide' },
              '404': { description: 'Invité introuvable' },
            },
          },
        },
      },
      components: {
        schemas: {
          Ceremony: ceremonySchema,
          Guest: guestSchema,
          CreateCeremonyDto: {
            type: 'object',
            required: [
              'title',
              'date',
              'startTime',
              'endTime',
              'location',
              'guestCount',
            ],
            properties: {
              title: { type: 'string', example: 'Réception de mariage' },
              date: { type: 'string', example: '2026-08-10' },
              startTime: { type: 'string', example: '14:00' },
              endTime: { type: 'string', example: '23:00' },
              location: { type: 'string', example: 'Palais des Congrès' },
              guestCount: { type: 'integer', example: 300 },
            },
          },
          UpdateCeremonyDto: {
            type: 'object',
            properties: {
              title: { type: 'string', example: "Vin d'honneur" },
              location: { type: 'string', example: 'Jardin principal' },
              guestCount: { type: 'integer', example: 320 },
            },
          },
          CreateGuestDto: {
            type: 'object',
            required: ['name', 'type', 'seatCount', 'uid', 'ceremonyId'],
            properties: {
              name: { type: 'string', example: 'MOUSSA DIABI' },
              type: {
                type: 'string',
                enum: ['Homme', 'Femme', 'Famille', 'Groupe'],
                example: 'Homme',
              },
              seatCount: { type: 'integer', example: 1 },
              uid: { type: 'string', example: 'MOUSSA-001' },
              ceremonyId: { type: 'integer', example: 1 },
              remarks: {
                type: 'string',
                nullable: true,
                example: 'Famille proche',
              },
            },
          },
          UpdateGuestDto: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Mr et Mme DIABY' },
              seatCount: { type: 'integer', example: 2 },
              remarks: { type: 'string', example: 'Mettre devant' },
            },
          },
          CheckInDto: {
            type: 'object',
            required: ['uid'],
            properties: {
              uid: { type: 'string', example: 'ABC123' },
              remarks: {
                type: 'string',
                nullable: true,
                example: 'Arrivé à 15h10',
              },
            },
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
