import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017",
      {
        dbName: "AgencyPR",
      },
    ),
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
