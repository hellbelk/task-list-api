import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {TaskModule} from './task/task.module';

const connectionString = 'mongodb://192.168.2.121/tasks';

@Module({
  imports: [TaskModule, MongooseModule.forRoot(connectionString)]
})
export class AppModule {}
