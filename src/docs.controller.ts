import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class DocsController {
  @Get()
  getDocs() {
    return {
      title: 'API Gestion de présence des invités',
      version: '1.0.0',
      endpoints: {
        ceremonies: [
          'POST /ceremonies',
          'GET /ceremonies',
          'GET /ceremonies/:id',
          'PATCH /ceremonies/:id',
          'DELETE /ceremonies/:id',
        ],
        guests: [
          'POST /guests',
          'GET /guests',
          'GET /guests/:id',
          'PATCH /guests/:id',
          'DELETE /guests/:id',
        ],
        checkIn: ['POST /check-in'],
      },
      checkInRules: [
        'Recherche par uid',
        'Si absent => Invité introuvable',
        'Si déjà PRESENT => Code déjà utilisé / UID non valide',
        'Sinon status=PRESENT et arrivalTime=now',
      ],
    };
  }
}
