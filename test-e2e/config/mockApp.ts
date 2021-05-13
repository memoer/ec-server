import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { config } from 'dotenv';
import { resolve } from 'path';
import { GraphQLFormattedError } from 'graphql';
import supertest from 'supertest';
import MockUser from './mockUser';

//
type QueryType = 'mutation' | 'query';
interface ErrorResponse {
  name: string;
  message: string;
  statusCode: number;
  error: string;
}
export interface TestData {
  query: string;
  set?: Record<string, any>;
  includeToken?: boolean;
}
export default class MockApp extends MockUser {
  public app!: INestApplication;
  private _testData!: TestData;
  //
  constructor() {
    super();
    config({ path: resolve(__dirname, '../.env.test') });
  }
  // * util
  getAuthHeader() {
    return { Authorization: `Bearer ${this.token}` };
  }
  getDesc(queryType: QueryType, text: string) {
    return `${queryType.toUpperCase()}: ${text}`;
  }
  // * get data from body
  getDataFromBody<T>(res: supertest.Response, key: string): T {
    return res.body.data[key];
  }
  getErrorFromBody(res: supertest.Response): GraphQLFormattedError[] {
    return res.body.errors;
  }
  // * get exception error
  getExceptionFromError(res: supertest.Response): ErrorResponse {
    const { extensions } = res.body.errors[0] as GraphQLFormattedError;
    return extensions?.exception;
  }
  // * test
  testData({ query, set, includeToken }: TestData): MockApp {
    if (set && includeToken) {
      this._testData = {
        query,
        set: {
          ...set,
          ...this.getAuthHeader(),
        },
      };
    } else if (set) {
      this._testData = { query, set };
    } else if (includeToken) {
      this._testData = { query, set: this.getAuthHeader() };
    } else {
      this._testData = { query };
    }
    return this;
  }
  sendGql(): request.Test {
    const { query, set } = this._testData;
    const spec = request(this.app.getHttpServer()).post('/graphql');
    if (set) spec.set(set);
    return spec.send({ query }).expect(200);
  }
}
