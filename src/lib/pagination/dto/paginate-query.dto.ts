import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaginateQueryDto {
  @ApiProperty({
    required: false,
    example: 'createdAt:desc',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  searchFields?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  query?: string;
}
