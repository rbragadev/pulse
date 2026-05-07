import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { department: true },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { department: true },
    });
  }

  findMany(params: { skip?: number; take?: number; where?: Prisma.UserWhereInput }) {
    return this.prisma.user.findMany({
      ...params,
      include: { department: true },
      orderBy: { name: 'asc' },
    });
  }

  count(where?: Prisma.UserWhereInput) {
    return this.prisma.user.count({ where });
  }

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      include: { department: true },
    });
  }

  update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: { department: true },
    });
  }
}
