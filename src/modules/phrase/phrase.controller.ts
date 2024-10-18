import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { UpdatePhraseDto } from './dto/update-phrase.dto';
import { PhraseService } from './phrase.service';
import { DeleteTranslationDto } from './dto/delete-translations.dto';
import { PaginateQueryDto } from 'src/lib/pagination/dto/paginate-query.dto';

@ApiTags('Phrase')
@Controller('phrase')
export class PhraseController {
  constructor(private readonly phraseService: PhraseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new phrase' })
  @ApiResponse({ status: 201, description: 'The created phrase' })
  async createPhrase(@Body() dto: CreatePhraseDto) {
    const phrase = await this.phraseService.create(dto);
    return { data: phrase, message: 'Phrase created successfully' };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a phrase by id' })
  @ApiParam({ name: 'id', description: 'Phrase id' })
  @ApiResponse({ status: 200, description: 'The updated phrase' })
  async updatePhrase(@Param('id') id: string, @Body() dto: UpdatePhraseDto) {
    const phrase = await this.phraseService.update(id, dto);
    return { data: phrase, message: 'Phrase updated successfully' };
  }

  @Delete('/translations')
  @ApiOperation({ summary: 'Delete translations by ids' })
  @ApiResponse({ status: 200, description: 'The deleted translations' })
  async deleteTranslations(@Body() dto: DeleteTranslationDto) {
    const translations = await this.phraseService.deleteTranslations(dto);
    return { data: translations, message: 'Translations deleted successfully' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a phrase by id' })
  @ApiParam({ name: 'id', description: 'Phrase id' })
  @ApiResponse({ status: 200, description: 'The deleted phrase' })
  async deletePhrase(@Param('id') id: string) {
    const phrase = await this.phraseService.delete(id);
    return { data: phrase, message: 'Phrase deleted successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'Get all phrases' })
  @ApiResponse({ status: 200, description: 'The found phrases' })
  async getPhrases() {
    const phrases = await this.phraseService.findAll();
    return { data: phrases, message: 'Phrases fetched successfully' };
  }

  @Get('languages')
  @ApiOperation({ summary: 'Get all languages' })
  @ApiResponse({ status: 200, description: 'The found languages' })
  async getLanguages() {
    const languages = await this.phraseService.findAllLanguages();
    return { data: languages, message: 'Languages fetched successfully' };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search phrases' })
  @ApiResponse({ status: 200, description: 'The found phrases' })
  async searchPhrases(@Query() dto: PaginateQueryDto) {
    const phrases = await this.phraseService.search(dto);
    return { data: phrases, message: 'Phrases fetched successfully' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a phrase by id' })
  @ApiParam({ name: 'id', description: 'Phrase id' })
  @ApiResponse({ status: 200, description: 'The found phrase' })
  async getPhrase(@Param('id') id: string) {
    const phrase = await this.phraseService.findOne(id);
    return { data: phrase, message: 'Phrase fetched successfully' };
  }

  @Get(':id/:language')
  @ApiOperation({ summary: 'Get a phrase translation' })
  @ApiParam({ name: 'id', description: 'Phrase id' })
  @ApiParam({ name: 'language', description: 'Language code' })
  @ApiResponse({ status: 200, description: 'The phrase translation' })
  async getTranslation(
    @Param('id') id: string,
    @Param('language') language: string,
  ) {
    const translation = await this.phraseService.findTranslation(id, language);
    return { data: translation, message: 'Translation fetched successfully' };
  }
}
