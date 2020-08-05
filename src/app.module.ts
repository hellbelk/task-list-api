import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {TaskModule} from './task/task.module';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';

const connectionString = process.env.MONGO_URL;

@Module({
  imports: [TaskModule,
    MongooseModule.forRoot(connectionString),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client')
    })]
})
export class AppModule {}
