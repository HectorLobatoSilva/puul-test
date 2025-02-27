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

  findAll() {
    return this.taskRepository.find({
      relations: ['asignedUsers'],
    });
  }

  findOne(id: number) {
    return this.taskRepository.findOne({
      where: { id },
      relations: ['asignedUsers'],
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['asignedUsers'],
    });
    if (!task) {
      return null;
    }
    const users = await this.userRepository.findBy({
      id: In(updateTaskDto.asignedUsers || []),
    });
    Object.assign(task, { ...updateTaskDto, asignedUsers: users });
    return this.taskRepository.save(task);
  }

  async remove(id: number) {
    return this.taskRepository.delete(id);
  }
}
