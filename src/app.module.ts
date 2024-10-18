import { PhraseModule } from "./modules/phrase/phrase.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [PhraseModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
