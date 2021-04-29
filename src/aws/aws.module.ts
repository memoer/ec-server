import { Module } from '@nestjs/common';
import awsConfig from '~/@config/aws.config';
import { AwsService } from './aws.service';

@Module({
  providers: [AwsService, { provide: awsConfig.KEY, useFactory: awsConfig }],
  exports: [AwsService],
})
export class AwsModule {}
