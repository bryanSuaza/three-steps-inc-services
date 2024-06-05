import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { Banner } from './entities/banner.entity';
import { CreateBannerDto, UpdateBannerDto } from './dto';
import { StorageS3Service } from 'src/storage-s3/storage-s3.service';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel( Banner.name )
    private readonly bannerModel: Model<Banner>,
    private readonly storageS3Service: StorageS3Service
  ) {}

  async create( createBannerDto: CreateBannerDto, file: Express.Multer.File ) {
    const fileName = createBannerDto.alt.split(' ').join('_');
    const mimetype = file.mimetype;
    const extension = file.originalname.split('.').pop();
    
    try {
      const url = await this.storageS3Service.uploadFileS3( '/banners', fileName, mimetype, extension, file.buffer );
  
      const banner = await this.bannerModel.create({
        ...createBannerDto, file: url
      });
  
      return banner;
      
    } catch ( error ) {
      this.handleExceptions( error );
    }
  }

  findAll( paginationDto: PaginationDto ) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.bannerModel.find()
      .limit( limit )
      .skip( offset )
      .sort({
        no: 1
      })
      .select('-__v');
  }

  async findOne( term: string ) {
    let banner: Banner;

    if ( !banner && isValidObjectId( term ) )
      banner = await this.bannerModel.findById( term );

    if ( !banner )
      throw new NotFoundException(`Banner with id or no "${ term }" not found`);

    return banner;
  }

  async update( id: string, updateBannerDto: UpdateBannerDto, file: Express.Multer.File ) {
    const banner = await this.findOne( id );
    let payload = { ...updateBannerDto, file: banner.file };

    // Validamos si se envia una imagen para actualizar
    if ( file ) {
      await this.storageS3Service.removeFileS3( banner.file );

      const fileName = updateBannerDto.alt.split(' ').join('_');
      const mimetype = file.mimetype;
      const extension = file.originalname.split('.').pop();

      const url = await this.storageS3Service.uploadFileS3( '/blog', fileName, mimetype, extension, file.buffer );
      
      payload.file = url;
    }

    try {
      // Se actualiza el registro
      await this.bannerModel.findByIdAndUpdate(id, { $set: payload }, { new: true }).exec();

      return {
        ...banner.toJSON(),
        ...updateBannerDto,
      };
      
    } catch ( error ) {
      this.handleExceptions( error );
    }
  }

  async remove( id: string ) {
    const banner = await this.findOne( id );

    const { deletedCount } = await this.bannerModel.deleteOne({ _id: id });
    
    if ( !banner && deletedCount === 0 )
      throw new BadRequestException(`Banner whit id "${ id }" not found`);
    else
      await this.storageS3Service.removeFileS3( banner.file );
    
    return { success: true };
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Banner exist in db ${ JSON.stringify( error.keyValue ) }`,
      );
    }

    throw new InternalServerErrorException(
      `Can´t create Banner - Check serve logs`,
    );
  }
}
