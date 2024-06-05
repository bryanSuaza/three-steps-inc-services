import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { fileFilter } from 'src/common/helpers';
import { BannersService } from './banners.service';
import { CreateBannerDto, UpdateBannerDto } from './dto';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter
  }))
  create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.bannersService.create( createBannerDto, file );
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.bannersService.findAll( paginationDto );
  }

  @Get(':term')
  findOne( @Param('term') term: string ) {
    return this.bannersService.findOne( term );
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter
  }))
  update(
    @Body() updateBannerDto: UpdateBannerDto,
    @Param('id', ParseMongoIdPipe) id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.bannersService.update( id, updateBannerDto, file );
  }

  @Delete(':id')
  remove( @Param('id', ParseMongoIdPipe) id: string ) {
    return this.bannersService.remove( id );
  }
}
