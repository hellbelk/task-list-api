import {
    Body,
    Controller, Delete,
    Get, Param,
    ParseIntPipe,
    Post,
    Query,
    Req,
    Request,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {TaskDto} from '../dto/task.dto';
import {SortTransformPipe} from '../pipes/sort.transform.pipe';
import {FileInterceptor} from '@nestjs/platform-express';
import {TaskService} from '../service/task.service';
import {ITask} from '../model/task.model';
import {SortDto} from '../dto/sort.dto';

@Controller('tasks')
export class TaskController {
    constructor(private taskService: TaskService) {
    }
    @Get()
    async getTasks(@Query('offset', ParseIntPipe) offset?: number,
                   @Query('limit', ParseIntPipe) limit?: number,
                   @Query('sort', SortTransformPipe) sort?: SortDto[]): Promise<ITask[]> {
        console.log('sort', sort);
        return this.taskService.getTasks(offset, limit, sort);
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