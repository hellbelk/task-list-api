import {Injectable} from '@nestjs/common';
import {CsvParser} from 'nest-csv-parser';
import {Readable} from 'stream';
import {TaskDto} from '../dto/task.dto';
import {TaskRepository} from '../repository/task.repository';
import {ITask} from '../model/task.model';
import {ListDataResponse} from '../model/list.data.response';
import {Sort} from '../model/sort.model';
import {Filter} from '../model/filter.model';
import {Option} from '../model/option.model';

@Injectable()
export class TaskService {
    constructor(private readonly csvParser: CsvParser, private readonly taskRepository: TaskRepository) {
    }

    async uploadTasksCSV(file): Promise<string[]> {
        const readStream = new Readable();
        readStream.push(file.buffer)
        readStream.push(null);

        const tasks: TaskDto[] = (await this.csvParser.parse(readStream, TaskDto)).list;

        return this.taskRepository.insertTasks(tasks);
    }

    async insertTasks(taskDtos: TaskDto[]): Promise<string[]> {
        return this.taskRepository.insertTasks(taskDtos);
    }

    async insertTask(taskDto: TaskDto): Promise<ITask> {
        return this.taskRepository.insertTask(taskDto);
    }

    async getTasks(offset?: number, limit?: number, sort?: Sort[], filters?: Filter[]): Promise<ListDataResponse<ITask>> {
        return this.taskRepository.getTasks(offset, limit, sort, filters);
    }

    async deleteTask(id: string, option: Option, priority?: number): Promise<void> {
        return this.taskRepository.deleteTask(id, option, priority);
    }
}