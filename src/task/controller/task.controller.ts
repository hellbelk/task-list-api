import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req,
    Request,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {TaskDto} from '../dto/task.dto';
import {ListDataQueryParamsPipe} from '../pipes/list.data.query.params.pipe';
import {FileInterceptor} from '@nestjs/platform-express';
import {TaskService} from '../service/task.service';
import {ITask} from '../model/task.model';
import {ListDataResponse} from '../model/list.data.response';
import {ListDataQueryParams} from '../dto/list.data.query.params';
import {EventsGateway} from './events.gateway';
import {MessageType} from '../model/message';
import {Option} from '../model/option.model';

@Controller('tasks')
export class TaskController {
    constructor(private taskService: TaskService, private eventsGateway: EventsGateway) {
    }
    @Get('list')
    async getTasks(@Query(ListDataQueryParamsPipe) {offset, limit, sort, filter}: ListDataQueryParams): Promise<ListDataResponse<ITask>> {
        return this.taskService.getTasks(offset, limit, sort, filter);
    }

    @Post()
    async createTask(@Body() data: TaskDto): Promise<ITask> {
        const result = await this.taskService.insertTask(data);
        this.eventsGateway.broadcast({
            type: MessageType.TASK_CREATED,
            body: result.id
        });

        return result;
    }

    @Post('bulk')
    @UseInterceptors(FileInterceptor('file'))
    async createTasks(@Req() request: Request, @Body() tasks?: TaskDto[], @UploadedFile() file?) {
        if (request.headers && request.headers['content-type']) {
            const contentType = request.headers['content-type'].split(';').map(term => term.trim());
            let ids = [];
            if (contentType.indexOf('application/json') !== -1) {
                if (tasks && tasks.length) {
                    ids = await this.taskService.insertTasks(tasks);
                }
            } else if (contentType.indexOf('multipart/form-data') !== -1 && file) {
                ids = await this.taskService.uploadTasksCSV(file);
            }

            if (ids && ids.length) {
                this.eventsGateway.broadcast({type: MessageType.TASKS_CREATED, body: ids})
            }
        }
    }

    @Delete(':id')
    async deleteTask(@Param('id') id: string,
                     @Query('option') option: Option,
                     @Query('priority') priority?: number) {
        await this.taskService.deleteTask(id, option, priority);
    }
}