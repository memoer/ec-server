import { NotFoundException } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { EntityNotFoundExceptionFilter } from '~/_lib';

describe('LogExceptionFilter', () => {
  // ? init variables
  const entityNotFoundException = new EntityNotFoundExceptionFilter();
  // ? init mocks
  class MockEntity {}

  it('should be defined', () => {
    expect(entityNotFoundException).toBeDefined();
  });

  it('', () => {
    // ? init variables
    const exception = new EntityNotFoundError(MockEntity, 'id');
    // ? run
    const result = entityNotFoundException.catch(exception);
    // ? test
    expect(result).toEqual(
      new NotFoundException(exception.message, exception.name),
    );
  });
});
