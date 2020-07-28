import {Injectable} from '@nestjs/common';
import {CsvParser} from 'nest-csv-parser';
import {Readable} from 'stream';
import {TaskDto} from '../dto/task.dto';
import {TaskRepository} from '../repository/task.repository';
import {ITask} from '../model/task.model';
import {SortDto} from '../dto/sort.dto';

@Injectable()
export class TaskService {
    constructor(private readonly csvParser: CsvParser, private readonly taskRepository: TaskRepository) {
    }

    async uploadTasksCSV(file): Promise<void> {
        const readStream = new Readable();
        readStream.push(file.buffer)
        readStream.push(null);

        const tasks: TaskDto[] = (await this.csvParser.parse(readStream, TaskDto)).list;

        return this.taskRepository.insertTasks(tasks);
    }

    async insertTasks(taskDtos: TaskDto[]): Promise<void> {
        return this.taskRepository.insertTasks(taskDtos);
    }

    async insertTask(taskDto: TaskDto): Promise<ITask> {
        return this.taskRepository.insertTask(taskDto);
    }

    async getTasks(offset?: number, limit?: number, sort?: SortDto[]): Promise<ITask[]> {
        return this.taskRepository.getTasks(offset, limit, sort);
    }

    async deleteTask(id: string): Promise<void> {
        return this.taskRepository.deleteTask(id);
    }
}