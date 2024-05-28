import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { Blog } from './entities/blog.entity';
import { CreateBlogDto, UpdateBlogDto } from './dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel( Blog.name )
    private readonly blogModel: Model<Blog>,
  ) {}

  async create ( createBlogDto: CreateBlogDto ) {    
    try {
      const blog = await this.blogModel.create(createBlogDto);
      return blog;
      
    } catch ( error ) {
      this.handleExceptions( error ); 
    }
  }

  async findAll ( paginationDto: PaginationDto ) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.blogModel.find()
      .limit( limit )
      .skip( offset )
      .sort({
        no: 1
      })
      .select('-__v');
  }

  async findOne( term: string ) {
    let blog: Blog;

    if ( !blog && isValidObjectId( term ) )
      blog = await this.blogModel.findById( term );

    if ( !blog )
      blog = await this.blogModel.findOne({ title: term.toLowerCase().trim() });

    if ( !blog )
      throw new NotFoundException(`Blog with id, title or no "${ term }" not found`);

    return blog;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  async remove( id: string ) {
    const { deletedCount } = await this.blogModel.deleteOne({ _id: id });
    if ( deletedCount === 0 ) throw new BadRequestException(`Blog whit id "${ id }" not found`);
    
    return { success: true };
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Blog exist in db ${ JSON.stringify( error.keyValue ) }`,
      );
    }

    throw new InternalServerErrorException(
      `Can´t create Blog - Check serve logs`,
    );
  }
}