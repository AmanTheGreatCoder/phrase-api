import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class TranslationDto {
  @ApiProperty({
    description: 'The language code for the translation',
    example: 'fr',
  })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({
    description: 'The translated text',
    example: 'Bonjour, je suis une phrase',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CreatePhraseDto {
  @ApiProperty({
    description: 'The main phrase text',
    example: "Hi, I'm a phrase",
  })
  @IsString()
  @IsNotEmpty()
  phrase: string;

  @ApiProperty({
    enum: Status,
    default: Status.active,
    description: 'The status of the phrase',
  })
  @IsEnum(Status)
  status: Status = Status.active;

  @ApiProperty({
    type: [TranslationDto],
    description: 'An array of translations for the phrase',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}
