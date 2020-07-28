import {ApiProperty} from '@nestjs/swagger';
import {ITask} from '../model/task.model';

export class TaskDto implements ITask {

    @ApiProperty({description: 'Task priority. Must be unique.'})
    priority: number;

    @ApiProperty({description: 'Task name'})
    name: string;

    @ApiProperty({description: 'Task description'})
    description?: string;
}