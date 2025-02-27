import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('api/v1/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll(
    @Query('filterByDeadline') filterByDeadline?: string,
    @Query('filterByTitle') filterByTitle?: string,
    @Query('filterByUserId') filterByUserId?: string,
    @Query('filterByUserName') filterByUserName?: string,
    @Query('filterByUserEmail') filterByUserEmail?: string,
  ) {
    return this.taskService.findAll({
      filterByDeadline: filterByDeadline
        ? new Date(filterByDeadline)
        : undefined,
      filterByTitle,
      filterByUserId: filterByUserId ? Number(filterByUserId) : undefined,
      filterByUserName,
      filterByUserEmail,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(Number(id), updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(Number(id));
  }

  @Get('metrics/completion-rate')
  getTaskCompletionRateByUser() {
    return this.taskService.getTaskCompletionRateByUser();
  }

  @Get('metrics/costs')
  getTaskEfficiencyMetrics() {
    return this.taskService.getCostEffiencyMetrics();
  }
}
