import {Injectable} from '@nestjs/common';
import {ITask} from '../model/task.model';
import {InjectModel, Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {TaskDto} from '../dto/task.dto';
import {Model, Document} from 'mongoose';
import {ListDataResponse} from '../model/list.data.response';
import {Filter} from '../model/filter.model';
import {Sort} from '../model/sort.model';
import {Option} from '../model/option.model';

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

    async insertTasks(taskDtos: TaskDto[]): Promise<string[]> {
        const res = await this.taskModel.bulkWrite(taskDtos.map(task => ({
            updateOne: {
                filter: {name: task.name},
                update: task,
                upsert: true
            }
        })));

        return Object.keys(res.upsertedIds).reduce((arr, id) => {
            arr.push(res.upsertedIds[id]);
            return arr;
        }, []);
    }

    async getTasks(offset?: number, limit?: number, sort?: Sort[], filters?: Filter[]): Promise<ListDataResponse<ITask>> {
        const conditions = {};
        if (filters && filters.length) {
            console.log(filters);
            filters.forEach(filter => {
                switch (filter.property) {
                    case 'priority': conditions[filter.property] = Number(filter.value); break;
                    case 'name': conditions[filter.property] = new RegExp(`^${filter.value}`, 'i'); break;
                    case 'description': conditions[filter.property] = new RegExp(filter.value, 'i'); break;
                }
            });
        }

        const request = () => this.taskModel.find(conditions);

        const total = await request().count();
        let data = null;
        if (total) {
            const query = request().find();


            if (offset !== null && offset !== undefined && limit !== null && limit !== undefined) {
                query.skip(offset).limit(limit);
            }
            if (sort && sort.length) {
                const sortQueryArg = sort.reduce((res: any, item: Sort) => {
                    res[item.property] = item.direction === 'asc' ? 1 : -1;
                    return res;
                }, {});

                query.sort(sortQueryArg);
            }
            const res = await query.exec();
            data = res ? res.map(this.mapRes) : null
        }

        return {
            data,
            offset,
            limit,
            total
        }
    }

    async deleteTask(id: string, option: Option, priority?: number): Promise<void> {
        const condition = {};
        if (option && option != 'eq' && priority) {
            const operation = `$${option}`;
            condition['priority'] = {[operation]: priority}
        } else if (!option || option === 'eq') {
            condition['_id'] = id;
        }

        await this.taskModel.remove(condition);
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