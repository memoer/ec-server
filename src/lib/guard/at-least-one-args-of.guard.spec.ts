import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { SharedService } from '~/shared/shared.service';
import { AtLeastOneArgsOfGuard } from './at-least-one-args-of.guard';

describe('AtLeastOneOfGuard', () => {
  const reflector = new Reflector();
  const sharedService = new SharedService();
  const context = new ExecutionContextHost(['test']);
  const atLeastOneArgsOfGuard = new AtLeastOneArgsOfGuard(
    reflector,
    sharedService,
  );

  it('should be defined', () => {
    expect(atLeastOneArgsOfGuard).toBeDefined();
  });
  it('', () => {
    atLeastOneArgsOfGuard.canActivate(context);
    // expect(mockGqlExecutionContext).toHaveBeenCalledTimes(1);
  });
});
