import { ImageKitResponse } from "./interfaces/ImageKitResponse";
import { Injectable } from "@nestjs/common";

const ImageKit = require("imagekit");

@Injectable()
export class ImageService {
  private _imagekit = new ImageKit({
    publicKey: "public_pFA/h6awLuiz+YdF1ZS5Wf+RMc8=",
    privateKey: "private_EmtwrUzmKkajcxUfKRwmf3Gon0c=",
    urlEndpoint: "https://ik.imagekit.io/ynk15b5o3c",
  });

  async upload(file: Express.Multer.File): Promise<ImageKitResponse> {
    return await this._imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });
  }
}
