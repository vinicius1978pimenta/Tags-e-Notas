import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() body: { title: string; content: string; tags?: string[] }) {
    return this.notesService.create(body);
  }

  @Get()
  findAll(@Query('tag') tag?: string) {
    return this.notesService.findAll(tag);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() body: { title?: string; content?: string; tags?: string[] },
  ) {
    return this.notesService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.notesService.remove(+id);
  }
}
