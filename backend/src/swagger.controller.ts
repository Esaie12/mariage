import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class SwaggerController {
  @Get('api-json')
  getOpenApiDocument() {
    const ceremonyExample = {
      id: 1,
      title: 'Mariage civil',
      date: '2026-08-10',
      startTime: '14:00',
      endTime: '18:00',
      location: 'Mairie de Paris',
      guestCount: 200,
    };

    const guestExample = {
      id: 1,
      name: 'Mr et Mme HOUSSA',
      type: 'Famille',
      seatCount: 3,
      uid: 'ABC123XYZ9',
      ceremonyId: 1,
      status: 'PENDING',
      arrivalTime: null,
      remarks: 'Arrivé avec 2 enfants',
    };

    return {
      openapi: '3.0.0',
      info: {
        title: 'API Gestion de présence des invités',
        version: '1.1.0',
        description:
          'Documentation complète avec exemples de requêtes/réponses pour chaque endpoint.',
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
                    examples: {
                      succes: {
                        value: [ceremonyExample],
                      },
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
                    exemple: {
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
                    examples: {
                      succes: { value: { ...ceremonyExample, title: 'Réception de mariage' } },
                    },
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
                    examples: { succes: { value: ceremonyExample } },
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
                    exemple: {
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
                    examples: {
                      succes: { value: { ...ceremonyExample, location: 'Salle des Fêtes', guestCount: 350 } },
                    },
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
                      succes: { value: { message: 'Cérémonie supprimée' } },
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
                    examples: {
                      succes: {
                        value: [guestExample],
                      },
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
                    exemple: {
                      value: {
                        name: 'Mr et Mme HOUSSA',
                        type: 'Famille',
                        seatCount: 3,
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
                    examples: {
                      succes: { value: guestExample },
                    },
                  },
                },
              },
            },
          },
        },

        '/guests/import/{ceremonyId}': {
          post: {
            tags: ['Guests'],
            summary: 'Importer des invités (CSV)',
            description:
              'Import en masse avec colonnes: nom, type, nombre de place. UID généré automatiquement.',
            parameters: [
              {
                name: 'ceremonyId',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                example: 1,
              },
            ],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    properties: {
                      file: { type: 'string', format: 'binary' },
                    },
                    required: ['file'],
                  },
                },
              },
            },
            responses: {
              '201': {
                description: 'Invités importés',
                content: {
                  'application/json': {
                    examples: {
                      succes: {
                        value: {
                          importedCount: 2,
                          guests: [
                            {
                              name: 'Moussa Diabi',
                              type: 'Homme',
                              seatCount: 1,
                              uid: 'A1B2C3D4E5',
                            },
                            {
                              name: 'Mr et Mme Houssa',
                              type: 'Famille',
                              seatCount: 3,
                              uid: 'F6G7H8I9J0',
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              },
              '400': { description: 'Fichier invalide / format incorrect' },
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
                    examples: { succes: { value: guestExample } },
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
                    exemple: {
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
                    examples: {
                      succes: { value: { ...guestExample, seatCount: 4, remarks: 'Arrive tard' } },
                    },
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
                      succes: { value: { message: 'Invité supprimé' } },
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
                    scanSimple: { value: { uid: 'ABC123XYZ9' } },
                    scanAvecRemarque: {
                      value: { uid: 'ABC123XYZ9', remarks: 'Présent, table 5' },
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
                    examples: {
                      succes: {
                        value: {
                          ...guestExample,
                          status: 'PRESENT',
                          arrivalTime: '2026-08-10T14:12:00.000Z',
                        },
                      },
                    },
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
          Ceremony: {
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
          },
          Guest: {
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
              uid: { type: 'string', example: 'ABC123XYZ9' },
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
          },
          CreateCeremonyDto: {
            type: 'object',
            required: ['title', 'date', 'startTime', 'endTime', 'location', 'guestCount'],
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
            required: ['name', 'type', 'seatCount', 'ceremonyId'],
            properties: {
              name: { type: 'string', example: 'MOUSSA DIABI' },
              type: {
                type: 'string',
                enum: ['Homme', 'Femme', 'Famille', 'Groupe'],
                example: 'Homme',
              },
              seatCount: { type: 'integer', example: 1 },
              ceremonyId: { type: 'integer', example: 1 },
              remarks: { type: 'string', nullable: true, example: 'Famille proche' },
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
              uid: { type: 'string', example: 'ABC123XYZ9' },
              remarks: { type: 'string', nullable: true, example: 'Arrivé à 15h10' },
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
        tryItOutEnabled: true,
      });
    </script>
  </body>
</html>`;

    return res.type('text/html').send(html);
  }
}
