# End Communiy - www.ec.com

### Running the app

```bash
# local server with docker
$ npm run start:local
# only run local server without docker
$ npm run start:local:server
```

### clear local docker container

```bash
local:docker:down
```

### Stack

- Nest
- TypeORM
- GraphQL
- Redis
- PostgreSQL
- github actions
- Sentry
- Docker
- Jest [TDD]
- AWS: VPC, ECS, RDS, S3, SES, SNS, SQS, Labmda[Image resizing]
- EFK: ElasticSearch, Fluentd, Kibana

### Env

- local: 각자 컴퓨터에서 띄운 개발환경 [ 기능추가, 버그수정 등등 수정한 코드 테스트용도 ]
- dev: 개발환경 [ 개발자 테스트용도 ]
- staging: 스테이징환경 [ Q/A (or) 베타테스트 용도 ]
- prod: 실서비스

### 환경별 설정

- 로깅: `prod`-custom format, `staging/dev/local`-'dev'
- 센트리, exceptionFilter: `prod/staging`-on, `dev/local`-off
- DB logging: `prod`-error,info,warn, `staging/dev`-error,warn `local`-all
  - `info`, `log` 가 어떤 로깅이 찍히는 지 볼 것
