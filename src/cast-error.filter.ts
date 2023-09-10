import { Catch, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Error } from 'mongoose';

@Catch(Error.CastError)
export class CastErrorFilter extends BaseExceptionFilter {
  catch(exception: Error.CastError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.kind === 'ObjectId') {
      response.status(404).json({
        statusCode: 404,
        message: 'Invalid resource ID',
      });
    } else {
      super.catch(exception, host);
    }
  }
}