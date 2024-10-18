import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateTranslationDto {
  @ApiProperty({
    description: 'The language code for the translation',
    example: 'fr',
  })
  @IsString()
  language: string;

  @ApiProperty({
    description: 'The translated text',
    example: 'Bonjour, je suis une phrase',
  })
  @IsString()
  text: string;
}

export class UpdatePhraseDto {
  @ApiProperty({
    description: 'The main phrase text',
    example: "Hi, I'm a phrase",
  })
  @IsString()
  @IsOptional()
  phrase?: string;

  @ApiProperty({
    enum: Status,
    default: Status.active,
    description: 'The status of the phrase',
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiProperty({
    type: [UpdateTranslationDto],
    description: 'An array of translations for the phrase',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTranslationDto)
  @IsOptional()
  translations?: UpdateTranslationDto[];
}
