import { ParseFilePipeBuilder } from "@nestjs/common";

const MB = (size: number) => size * 1024 * 1000;

export const ParseImagePipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: RegExp(/\/(jpg|jpeg|png)$/),
  })
  .addMaxSizeValidator({
    maxSize: MB(2),
  })
  .build({
    fileIsRequired: true,
  });
