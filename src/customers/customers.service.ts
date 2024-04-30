import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './entities/customer.entity';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      createCustomerDto.state = 'I';

      const customer = await this.customerModel.create(createCustomerDto);
      return {
        success: true,
        customer,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    const customers = await this.customerModel.find().select('-__v');

    if (!customers) {
      throw new NotFoundException('Not found customers in db');
    }

    return customers;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    let customer: Customer;

    if (isValidObjectId(id)) {
      customer = await this.customerModel.findById(id);
    }

    if (!customer) {
      throw new NotFoundException(`Not found customer with id: ${id} in db`);
    }

    try {
      await customer.updateOne(updateCustomerDto);

      return {
        success: true,
        customer: {
          ...customer.toJSON(),
          ...updateCustomerDto,
        },
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Customer exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can´t create Customer - Check serve logs`,
    );
  }
}
