import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create( @Body() createBlogDto: CreateBlogDto ) {
    return this.blogService.create( createBlogDto );
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
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove( @Param('id', ParseMongoIdPipe) id: string ) {
    return this.blogService.remove( id );
  }
}
