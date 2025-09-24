import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class NotesService {
 constructor(private readonly prisma: PrismaService) {}

 async create(data: { title: string; content: string; tags?: string[] }) {
  const { title, content, tags = [] } = data;

  return this.prisma.note.create({
    data: {
      title,
      content,
      tags: {
        create: tags.map(tag => ({
          tag: {
            connectOrCreate: {
              where: { name: tag },
              create: { name: tag },
            },
          },
        })),
      },
    },
    include: { tags: { include: { tag: true } } },
  });
}

async findAll(tag?: string) {
  return this.prisma.note.findMany({
    where: tag ? { tags: { some: { tag: { name: tag } } } } : {},
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

async update(id: number, data: { title?: string; content?: string; tags?: string[] }) {
  const { title, content, tags } = data;

  return this.prisma.note.update({
    where: { id },
    data: {
      title,
      content,
      ...(tags && {
        tags: {
          deleteMany: {},
          create: tags.map(tag => ({
            tag: {
              connectOrCreate: {
                where: { name: tag },
                create: { name: tag },
              },
            },
          })),
        },
      }),
    },
    include: { tags: { include: { tag: true } } },
  });
}

async remove(id: number) {
  // Deleta os links com tags
  await this.prisma.noteTag.deleteMany({
    where: { noteId: id },
  });

  // Deleta a nota
  return this.prisma.note.delete({
    where: { id },
  });
}

  
  

}
