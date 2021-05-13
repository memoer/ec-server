import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '~/app/app.module';
import { MockApp } from './config';
import app from './1.app.e2e';
import user from './2.user.e2e';
import './config/extendExpect';

function startTest() {
  // ! set variables
  const mockApp = new MockApp();
  let nestApp: INestApplication;
  // ! initialize
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    nestApp = module.createNestApplication();
    await nestApp.init();
    mockApp.app = nestApp;
  });
  // ! start test
  app(mockApp);
  user(mockApp);
}

startTest();
