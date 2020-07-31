import {
    Body,
    Controller, Delete,
    Get, Param,
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

@Controller('tasks')
export class TaskController {
    constructor(private taskService: TaskService) {
    }
    @Get()
    async getTasks(@Query(ListDataQueryParamsPipe) {offset, limit, sort, filter}: ListDataQueryParams): Promise<ListDataResponse<ITask>> {
        return this.taskService.getTasks(offset, limit, sort, filter);
    }

    @Post()
    async createTask(@Body() data: TaskDto): Promise<ITask> {
        return this.taskService.insertTask(data);
    }

    @Post('bulk')
    @UseInterceptors(FileInterceptor('file'))
    async createTasks(@Req() request: Request, @Body() tasks?: TaskDto[], @UploadedFile() file?) {
        if (request.headers && request.headers['content-type']) {
            const contentType = request.headers['content-type'].split(';').map(term => term.trim());
            if (contentType.indexOf('application/json') !== -1) {
                if (tasks && tasks.length) {
                    await this.taskService.insertTasks(tasks);
                }
            } else if (contentType.indexOf('multipart/form-data') !== -1 && file) {
                await this.taskService.uploadTasksCSV(file);
            }
        }
    }

    @Delete(':id')
    async deleteTask(@Param('id') id: string) {
        await this.taskService.deleteTask(id);
    }


}