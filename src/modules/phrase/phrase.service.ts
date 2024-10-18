import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Phrase, Prisma, Status, Translation } from '@prisma/client';
import * as languages from 'language-list';
import { PaginateQueryDto } from 'src/lib/pagination/dto/paginate-query.dto';
import { paginate } from 'src/lib/pagination/paginate';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { DeleteTranslationDto } from './dto/delete-translations.dto';
import { UpdatePhraseDto } from './dto/update-phrase.dto';

@Injectable()
export class PhraseService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const phrase = await this.prisma.phrase.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!phrase) {
      throw new NotFoundException(`Phrase with ID ${id} not found`);
    }

    return phrase;
  }

  async findTranslation(id: string, language: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { phraseId_language: { phraseId: id, language } },
    });

    if (!translation) {
      throw new NotFoundException(
        `Translation not found for phrase ID ${id} and language ${language}`,
      );
    }

    return translation.text;
  }

  async search(dto: PaginateQueryDto) {
    const pagination = paginate(dto);
    console.log('pagination', pagination);

    const phraseOrderBy: Prisma.PhraseOrderByWithRelationInput[] = [];
    let translationOrderBy: Prisma.TranslationOrderByWithRelationInput = {};

    if (Array.isArray(pagination.orderBy)) {
      pagination.orderBy.forEach((orderItem) => {
        if ('translations' in orderItem) {
          translationOrderBy =
            orderItem.translations as Prisma.TranslationOrderByWithRelationInput;
        } else {
          phraseOrderBy.push(
            orderItem as Prisma.PhraseOrderByWithRelationInput,
          );
        }
      });
    }

    console.log('phraseOrderBy', phraseOrderBy);
    console.log(
      'translationOrderBy',
      JSON.stringify(translationOrderBy, null, 2),
    );

    const whereClause: Prisma.PhraseWhereInput = {
      deletedAt: null,
    };

    if (pagination.where && 'OR' in pagination.where) {
      const searchTerm =
        (pagination.where.OR[0] as any)?.phrase?.contains || '';
      whereClause.OR = [
        { phrase: { contains: searchTerm, mode: 'insensitive' } },
        {
          status: {
            in: Object.values(Status).filter((s) =>
              s.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
          },
        },
      ];
    }

    const phrases = await this.prisma.phrase.findMany({
      orderBy: phraseOrderBy,
      where: whereClause,
      include: {
        translations: {
          orderBy:
            Object.keys(translationOrderBy).length > 0
              ? translationOrderBy
              : undefined,
        },
      },
    });

    return phrases;
  }

  async create(dto: CreatePhraseDto) {
    const { phrase, translations } = dto;

    const existingPhrase = await this.prisma.phrase.findFirst({
      where: { phrase: phrase, deletedAt: null },
    });

    console.log('existingPhrase', existingPhrase);

    if (existingPhrase) {
      throw new ConflictException(`Phrase "${phrase}" already exists`);
    }

    const createdPhrase = await this.prisma.phrase.create({
      data: {
        phrase,
        translations: {
          create: translations.map((t) => ({
            language: t.language.toLowerCase(),
            text: t.text,
          })),
        },
      },
      include: { translations: true },
    });

    return createdPhrase;
  }

  async findAll() {
    return await this.prisma.phrase.findMany({
      where: { deletedAt: null },
      include: { translations: true },
    });
  }

  async update(id: string, dto: UpdatePhraseDto) {
    const { phrase, status, translations } = dto;

    const existingPhrase = await this.prisma.phrase.findUnique({
      where: { id, deletedAt: null },
      include: { translations: true },
    });

    if (!existingPhrase) {
      throw new NotFoundException(`Phrase with ID ${id} not found`);
    }

    const upsertTranslations = translations.map((translation) => ({
      where: {
        phraseId_language: {
          phraseId: id,
          language: translation.language,
        },
      },
      update: {
        text: translation.text,
      },
      create: {
        language: translation.language,
        text: translation.text,
      },
    }));

    const updatedPhrase = await this.prisma.phrase.update({
      where: { id },
      data: {
        phrase,
        status,
        translations: {
          upsert: upsertTranslations,
        },
      },
      include: { translations: true },
    });

    return updatedPhrase;
  }

  async delete(id: string) {
    const existingPhrase = await this.prisma.phrase.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingPhrase) {
      throw new NotFoundException(`Phrase with ID ${id} not found`);
    }

    const phrase = await this.prisma.phrase.update({
      where: { id },
      data: {
        status: Status.deleted,
        deletedAt: new Date(),
      },
    });

    return phrase;
  }

  async deleteTranslations(dto: DeleteTranslationDto) {
    const { ids } = dto;

    return await this.prisma.translation.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async findAllLanguages() {
    const languageList = new languages();
    return languageList?.getData();
  }

  private formatPhraseOutput(phrase: Phrase & { translations: Translation[] }) {
    const { translations, ...phraseData } = phrase;

    return {
      ...phraseData,
      translations: translations.reduce((acc, t) => {
        acc[t.language] = t.text;
        return acc;
      }, {}),
    };
  }
}
