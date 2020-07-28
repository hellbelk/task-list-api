import {Injectable} from '@nestjs/common';
import {ITask} from '../model/task.model';
import {InjectModel, Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {TaskDto} from '../dto/task.dto';
import {Model, Document} from 'mongoose';
import {SortDto} from '../dto/sort.dto';
import {ListDataResponse} from '../model/list.data.response';

@Schema()
export class Task extends Document implements ITask {
    @Prop({required: true})
    priority: number;

    @Prop({required: true, unique: true})
    name: string;

    @Prop()
    description?: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

@Injectable()
export class TaskRepository {
    constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {
    }

    async insertTask(taskDto: TaskDto): Promise<ITask> {
        const task = new this.taskModel(taskDto);
        const res = await task.save();
        return res ? this.mapRes(res) : null;
    }

    async insertTasks(taskDtos: TaskDto[]): Promise<void> {
        await this.taskModel.bulkWrite(taskDtos.map(task => ({
            updateOne: {
                filter: {name: task.name},
                update: task,
                upsert: true
            }
        })));
    }

    async getTasks(offset?: number, limit?: number, sort?: SortDto[]): Promise<ListDataResponse<ITask>> {
        const query = this.taskModel.find();
        const total = await this.taskModel.find().count();

        if (offset !== null && offset !== undefined && limit !== null && limit !== undefined ) {
            query.skip(offset).limit(limit);
        }
        if (sort && sort.length) {
            const sortQueryArg = sort.reduce((res: any, item: SortDto) => {
                res[item.property] = item.direction === 'asc' ? 1 : -1;
                return res;
            }, {});

            query.sort(sortQueryArg);
        }
        const res =  await query.exec();

        return {
            data: res ? res.map(this.mapRes) : null,
            offset,
            limit,
            total
        }
    }

    async deleteTask(id: string): Promise<void> {
        await this.taskModel.remove({_id: id})
    }

    private mapRes(data: any): ITask {
        return {
            id: data._id,
            name: data.name,
            description: data.description,
            priority: data.priority
        }
    }
}