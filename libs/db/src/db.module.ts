import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import 'reflect-metadata';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.model';
import { Share, ShareSchema } from '../models/share.model';
import { FileSchema, File } from '../models/file_info.model';
import { CommonFileSchema, CommonFile } from '../models/commonFile.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
const models = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: File.name, schema: FileSchema },
  { name: Share.name, schema: ShareSchema },
  { name: CommonFile.name, schema: CommonFileSchema },
]);

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: 'mongodb://merikle-pan-mongo:27017/pan?authSource=admin',
        // pass: 'mongo_M7dAPh',
        // user: 'mongo_eEptY5',
      }),
      inject: [ConfigService],
    }),
    models,
  ],
  providers: [DbService],
  exports: [DbService, MongooseModule],
})
export class DbModule {}
