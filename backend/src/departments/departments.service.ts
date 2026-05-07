import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.department.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { name: 'asc' },
    });
  }

  create(name: string) {
    return this.prisma.department.create({ data: { name } });
  }

  delete(id: string) {
    return this.prisma.department.delete({ where: { id } });
  }
}
