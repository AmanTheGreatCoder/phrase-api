import { Test, TestingModule } from '@nestjs/testing';
import { PhraseController } from './phrase.controller';
import { PhraseService } from './phrase.service';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { UpdatePhraseDto } from './dto/update-phrase.dto';
import { DeleteTranslationDto } from './dto/delete-translations.dto';
import { PaginateQueryDto } from 'src/lib/pagination/dto/paginate-query.dto';
import { Status } from '@prisma/client';

describe('PhraseController', () => {
  let controller: PhraseController;
  let service: PhraseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhraseController],
      providers: [
        {
          provide: PhraseService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            deleteTranslations: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
            findAllLanguages: jest.fn(),
            search: jest.fn(),
            findOne: jest.fn(),
            findTranslation: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PhraseController>(PhraseController);
    service = module.get<PhraseService>(PhraseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPhrase', () => {
    it('should create a new phrase', async () => {
      const dto: CreatePhraseDto = {
        phrase: 'Test phrase',
        status: 'active',
        translations: [{ language: 'en', text: 'Test translation' }],
      };
      const mockPhrase = {
        id: '1',
        phrase: 'Test phrase',
        status: 'active' as Status,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        translations: [
          {
            id: '1',
            language: 'en',
            text: 'Test translation',
            createdAt: new Date(),
            updatedAt: new Date(),
            phraseId: '1',
          },
        ],
      };
      jest.spyOn(service, 'create').mockResolvedValue(mockPhrase);

      const result = await controller.createPhrase(dto);
      expect(result).toEqual({
        data: mockPhrase,
        message: 'Phrase created successfully',
      });
    });
  });

  describe('updatePhrase', () => {
    it('should update a phrase', async () => {
      const id = '1';
      const dto: UpdatePhraseDto = {
        phrase: 'Updated phrase',
        status: 'active' as Status,
        translations: [{ language: 'en', text: 'Updated translation' }],
      };
      const mockPhrase = {
        id,
        phrase: 'Updated phrase',
        status: 'active' as Status,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        translations: [
          {
            id: '1',
            language: 'en',
            text: 'Updated translation',
            createdAt: new Date(),
            updatedAt: new Date(),
            phraseId: id,
          },
        ],
      };
      jest.spyOn(service, 'update').mockResolvedValue(mockPhrase);

      const result = await controller.updatePhrase(id, dto);
      expect(result).toEqual({
        data: mockPhrase,
        message: 'Phrase updated successfully',
      });
    });
  });

  describe('deleteTranslations', () => {
    it('should delete translations', async () => {
      const dto: DeleteTranslationDto = { ids: ['1', '2'] };
      const mockTranslations = {
        data: [],
        count: 0,
      };
      jest
        .spyOn(service, 'deleteTranslations')
        .mockResolvedValue(mockTranslations);

      const result = await controller.deleteTranslations(dto);
      expect(result).toEqual({
        data: mockTranslations,
        message: 'Translations deleted successfully',
      });
    });
  });

  describe('deletePhrase', () => {
    it('should delete a phrase', async () => {
      const id = '1';
      const mockPhrase = {
        id,
        phrase: 'Deleted phrase',
        status: 'deleted' as Status,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };
      jest.spyOn(service, 'delete').mockResolvedValue(mockPhrase);

      const result = await controller.deletePhrase(id);
      expect(result).toEqual({
        data: mockPhrase,
        message: 'Phrase deleted successfully',
      });
    });
  });

  describe('getPhrases', () => {
    it('should get all phrases', async () => {
      const mockPhrases = [
        {
          id: '1',
          phrase: 'Phrase 1',
          status: 'active' as Status,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          translations: [
            {
              id: '1',
              language: 'en',
              text: 'Test translation',
              createdAt: new Date(),
              updatedAt: new Date(),
              phraseId: '1',
            },
          ],
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockPhrases);

      const result = await controller.getPhrases();
      expect(result).toEqual({
        data: mockPhrases,
        message: 'Phrases fetched successfully',
      });
    });
  });

  describe('getLanguages', () => {
    it('should get all languages', async () => {
      const mockLanguages = ['en', 'es', 'fr'];
      jest.spyOn(service, 'findAllLanguages').mockResolvedValue(mockLanguages);

      const result = await controller.getLanguages();
      expect(result).toEqual({
        data: mockLanguages,
        message: 'Languages fetched successfully',
      });
    });
  });

  describe('searchPhrases', () => {
    it('should search phrases', async () => {
      const dto: PaginateQueryDto = { query: 'test' };
      const mockPhrases = [
        {
          id: '1',
          phrase: 'Test phrase',
          status: 'active' as Status,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          translations: [
            {
              id: '1',
              language: 'en',
              text: 'Test translation',
              createdAt: new Date(),
              updatedAt: new Date(),
              phraseId: '1',
            },
          ],
        },
      ];
      jest.spyOn(service, 'search').mockResolvedValue(mockPhrases);

      const result = await controller.searchPhrases(dto);
      expect(result).toEqual({
        data: mockPhrases,
        message: 'Phrases fetched successfully',
      });
    });
  });

  describe('getPhrase', () => {
    it('should get a phrase by id', async () => {
      const id = '1';
      const mockPhrase = {
        id,
        phrase: 'Test phrase',
        status: 'active' as Status,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        translations: [
          {
            id: '1',
            language: 'en',
            text: 'Test translation',
            createdAt: new Date(),
            updatedAt: new Date(),
            phraseId: id,
          },
        ],
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPhrase);

      const result = await controller.getPhrase(id);
      expect(result).toEqual({
        data: mockPhrase,
        message: 'Phrase fetched successfully',
      });
    });
  });

  describe('getTranslation', () => {
    it('should get a phrase translation', async () => {
      const id = '1';
      const language = 'en';
      const mockTranslation = 'Test translation';
      jest.spyOn(service, 'findTranslation').mockResolvedValue(mockTranslation);

      const result = await controller.getTranslation(id, language);
      expect(result).toEqual({
        data: mockTranslation,
        message: 'Translation fetched successfully',
      });
    });
  });
});
