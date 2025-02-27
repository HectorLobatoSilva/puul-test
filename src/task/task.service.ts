import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const task: Task = new Task();
    const users = await this.userRepository.findBy({
      id: In(createTaskDto.asignedUsers || []),
    });
    Object.assign(task, { ...createTaskDto, asignedUsers: users });
    return this.taskRepository.save(task);
  }

  async findAll(filters?: {
    filterByDeadline?: Date;
    filterByTitle?: string;
    filterByUserId?: number;
    filterByUserName?: string;
    filterByUserEmail?: string;
  }) {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.asignedUsers', 'user');

    if (filters?.filterByDeadline) {
      query.andWhere('task.deadline = :deadline', {
        deadline: filters.filterByDeadline,
      });
    }

    if (filters?.filterByTitle) {
      query.andWhere('task.title LIKE :title', {
        title: `%${filters.filterByTitle}%`,
      });
    }

    if (filters?.filterByUserId) {
      query.andWhere('user.id = :userId', {
        userId: filters.filterByUserId,
      });
    }

    if (filters?.filterByUserName) {
      query.andWhere('user.name LIKE :userName', {
        userName: `%${filters.filterByUserName}%`,
      });
    }

    if (filters?.filterByUserEmail) {
      query.andWhere('user.email LIKE :userEmail', {
        userEmail: `%${filters.filterByUserEmail}%`,
      });
    }

    return query.getMany();
  }

  findOne(id: number) {
    return this.taskRepository.findOne({
      where: { id },
      relations: ['asignedUsers'],
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    if (!task) {
      return null;
    }
    let users: User[] = task.asignedUsers;
    if (updateTaskDto.asignedUsers) {
      users = await this.userRepository.findBy({
        id: In(updateTaskDto.asignedUsers || []),
      });
    }
    Object.assign(task, { ...updateTaskDto, asignedUsers: users });
    return this.taskRepository.save(task);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    if (!task) {
      return null;
    }
    // Remove the relations first
    task.asignedUsers = [];
    await this.taskRepository.save(task);
    // Then delete the task
    return this.taskRepository.delete(id);
  }

  async getTaskCompletionRateByUser() {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoin('user_tasks_task', 'user_task', 'task.id = user_task.taskId')
      .leftJoin('user', 'us', 'user_task.userId = us.id')
      .select([
        'us.name as name',
        "COUNT(CASE WHEN task.state = 'completed' THEN 1 END) as completed_tasks",
        "COUNT(CASE WHEN task.state = 'active' THEN 1 END) as in_progress_tasks",
        'COUNT(task.id) as total_tasks',
        "CAST(COUNT(CASE WHEN task.state = 'completed' THEN 1 END) * 100.0 / COUNT(task.id) AS DECIMAL(5,2)) as completion_rate",
        'SUM(task.costPerTask) as total_cost',
        "SUM((CASE WHEN state = 'completed' THEN 1 END) * task.costPerTask) as current_payment",
      ])
      .groupBy('"userId"')
      .addGroupBy('us.name')
      .orderBy('"userId"');

    const results = await query.getRawMany();
    return results.map((result) => ({
      userName: result.name,
      completedTasks: parseInt(result.completed_tasks) || 0,
      inProgressTasks: parseInt(result.in_progress_tasks) || 0,
      totalTasks: parseInt(result.total_tasks) || 0,
      completionRate: parseFloat(result.completion_rate) || 0,
      totalCost: parseFloat(result.total_cost) || 0,
      currentPayment: parseFloat(result.current_payment) || 0,
    }));
  }

  async getCostEffiencyMetrics() {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoin('user_tasks_task', 'user_task', 'task.id = user_task.taskId')
      .leftJoin('user', 'us', 'user_task.userId = us.id')
      .select([
        'us.name as name',
        'SUM(task.estimatedHours) as estimated_hours',
        "SUM((CASE WHEN state = 'completed' THEN 1 END) * task.estimatedHours) as worked_hours",
        "SUM((CASE WHEN state = 'completed' THEN 1 END) * task.estimatedHours) / SUM(task.estimatedHours)::float*100 as completition_rate",
        'SUM(task.costPerTask) / SUM(task.estimatedHours) as cost_per_hour',
      ])
      .groupBy('"userId"')
      .addGroupBy('us.name')
      .orderBy('"userId"');

    const results = await query.getRawMany();
    return results.map((result) => ({
      userName: result.name,
      estimatedHours: parseFloat(result.estimated_hours) || 0,
      workedHours: parseFloat(result.worked_hours) || 0,
      completionRate: parseFloat(result.completion_rate) || 0,
      costPerHour: parseFloat(result.cost_per_hour) || 0,
    }));
  }
}
