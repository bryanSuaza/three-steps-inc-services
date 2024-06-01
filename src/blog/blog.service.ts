import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { Blog } from './entities/blog.entity';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { StorageS3Service } from 'src/storage-s3/storage-s3.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel( Blog.name )
    private readonly blogModel: Model<Blog>,
    private readonly storageS3Service: StorageS3Service
  ) {}

  async create ( createBlogDto: CreateBlogDto, file: Express.Multer.File ) {
    try {
      const fileName = createBlogDto.title.split(' ').join('_');
      const mimetype = file.mimetype;
      const extension = file.originalname.split('.').pop();
      const path = '/blog';

      const urlImage = await this.storageS3Service.uploadFileS3( path, fileName, mimetype, extension, file.buffer );
      
      const blog = await this.blogModel.create({
        ...createBlogDto,
        slug: createBlogDto.title.split(' ').join('-').toLowerCase(),
        image: urlImage
      });

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

  async update( id: string, updateBlogDto: UpdateBlogDto, file?: Express.Multer.File ) {
    const blog = await this.blogModel.findById( id );

    if ( !blog )
      throw new NotFoundException(`Blog whit id ${ id } not found`);

    let payload = { ...updateBlogDto, slug: updateBlogDto.title.split(' ').join('-').toLowerCase(), image: blog.image };

    if ( file ) {
      await this.storageS3Service.removeFileS3( blog.image );

      const fileName = updateBlogDto.title.split(' ').join('_');
      const mimetype = file.mimetype;
      const extension = file.originalname.split('.').pop();
      const path = '/blog';

      const url = await this.storageS3Service.uploadFileS3( path, fileName, mimetype, extension, file.buffer );
      
      payload = { ...payload, image: url }
    }

    try {
      // Actualizamos
      await this.blogModel.updateOne(payload);

      return {
        ...blog.toJSON(),
        ...updateBlogDto,
      };
      
    } catch ( error ) {
      this.handleExceptions( error );
    }
  }

  async remove( id: string ) {
    const blog = await this.findOne( id );

    const { deletedCount } = await this.blogModel.deleteOne({ _id: id });
    
    if ( deletedCount === 0 )
      throw new BadRequestException(`Blog whit id "${ id }" not found`);
    else
      await this.storageS3Service.removeFileS3(blog.image);
    
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