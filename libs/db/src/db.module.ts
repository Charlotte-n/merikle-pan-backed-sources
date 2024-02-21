import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import 'reflect-metadata';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/pan', {
      autoIndex: true,
      autoCreate: true,
    }),
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
