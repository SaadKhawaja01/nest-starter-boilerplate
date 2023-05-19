import { Controller, Get } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { readFileSync } from "fs";

@Controller()
export class AppController {
  @ApiExcludeEndpoint()
  @Get()
  getHello(): string {
    return `Api Online ${
      JSON.parse(readFileSync("./package.json", "utf8")).version
    }`;
  }
}
