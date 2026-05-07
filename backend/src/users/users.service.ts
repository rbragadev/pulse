import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findById(id: string) {
    return this.usersRepository.findById(id);
  }

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { isActive: true };
    const [users, total] = await Promise.all([
      this.usersRepository.findMany({ skip, take: limit, where }),
      this.usersRepository.count(where),
    ]);
    return { users, total, page, limit };
  }

  create(data: CreateUserDto) {
    return this.usersRepository.create(data);
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return this.usersRepository.update(id, data);
  }
}
