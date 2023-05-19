import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpStatus, RequestMethod, ValidationPipe } from "@nestjs/common";
import axios from "axios";
import { AppModule } from "./app/app.module";
import { NestFactory } from "@nestjs/core";
import { readFileSync } from "fs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.setGlobalPrefix("api", {
    exclude: [{ path: "/", method: RequestMethod.GET }],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
    }),
  );

  const appJson = JSON.parse(readFileSync("./package.json", "utf8"));

  const config = new DocumentBuilder()
    .setTitle(appJson.name)
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  const port = process.env.PORT || 3000;
  await app.listen(port);

  const discordHook = process.env.DISCORD_HOOK;

  const clientInstructions = readFileSync("./client-instructions.txt", "utf-8");

  if (port !== 3000 && discordHook) {
    await axios.post(discordHook, {
      content: `The server (v${appJson.version}) has started after deploying some updates. ${clientInstructions}.`,
    });
  }
}

bootstrap();
