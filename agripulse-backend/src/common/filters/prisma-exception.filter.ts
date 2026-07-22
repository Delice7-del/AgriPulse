import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code === 'P2025') {
      const notFound = new NotFoundException('Record not found');
      return response.status(HttpStatus.NOT_FOUND).json(notFound.getResponse());
    }

    if (exception.code === 'P2002') {
      const conflict = new ConflictException(
        'A record with this unique value already exists',
      );
      return response.status(HttpStatus.CONFLICT).json(conflict.getResponse());
    }

    return response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Database request failed',
      error: 'Bad Request',
    });
  }
}
