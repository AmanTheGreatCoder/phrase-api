import { PhraseService } from './phrase.service';
import { PhraseController } from './phrase.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PhraseController],
  providers: [PhraseService],
})
export class PhraseModule {}
