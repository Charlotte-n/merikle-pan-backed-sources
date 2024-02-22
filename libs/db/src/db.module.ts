import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import 'reflect-metadata';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.model';
const models = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://admin:admin@localhost:27017/pan?authSource=admin',
    ),
    models,
  ],
  providers: [DbService],
  exports: [DbService, MongooseModule],
})
export class DbModule {}
