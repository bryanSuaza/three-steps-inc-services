import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { fileFilter } from './helpers';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter
  }))
  create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.blogService.create( createBlogDto, file );
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.blogService.findAll( paginationDto );
  }

  @Get(':term')
  findOne( @Param('term') term: string ) {
    return this.blogService.findOne( term );
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter
  }))
  update(
    @Body() updateBlogDto: UpdateBlogDto,
    @Param('id', ParseMongoIdPipe) id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.blogService.update( id, updateBlogDto, file );
  }

  @Delete(':id')
  remove( @Param('id', ParseMongoIdPipe) id: string ) {
    return this.blogService.remove( id );
  }
}
