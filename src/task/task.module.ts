import {Module} from '@nestjs/common';
import {CsvModule} from 'nest-csv-parser';
import {MongooseModule} from '@nestjs/mongoose';
import {Task, TaskRepository, TaskSchema} from './repository/task.repository';
import {TaskController} from './controller/task.controller';
import {TaskService} from './service/task.service';
import {EventsGateway} from './controller/events.gateway';

@Module({
    imports: [CsvModule, MongooseModule.forFeature([{name: Task.name, schema: TaskSchema}])],
    controllers: [TaskController],
    providers: [TaskService, TaskRepository, EventsGateway]
})
export class TaskModule {}