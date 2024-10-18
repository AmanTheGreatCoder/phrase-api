import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DeleteTranslationDto {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
