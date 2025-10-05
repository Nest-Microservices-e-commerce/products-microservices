import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(private prisma: PrismaService){}
  
  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll( paginationDto: PaginationDto ) {

    const { page = 1, limit = 10 } = paginationDto;

    const total = await this.prisma.product.count({ where: { available: true } }); 

    const lastPage = Math.ceil( total / limit );

    return {
        data: await this.prisma.product.findMany({
        skip: ( page -1 ) * limit,
        take: limit,
        where: { available: true },
        orderBy: { id: 'asc' },
      }),
      meta: {
        total: total,
        page: page,
        lastPage: lastPage,
        limit: limit,
      },
    }
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id, available: true } });

    if ( !product ) {
      throw new NotFoundException(`Product with id #${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {

    await this.findOne(id);

    return await this.prisma.product.update({
      where: { id },
      data: { available: false },
    })

  }
}
