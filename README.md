### Running the app

```bash
# local server with docker
$ npm run start:local
# only run local server without docker
$ npm run start:local:server
```

### clear local docker container

```bash
$ npm run local:docker:down
```

### Stack

- Nest
- TypeORM
- GraphQL
- Redis
- PostgreSQL
- Sentry
- Docker
- Jest [TDD]

# Folder Naming Rules

- @\*\*: Required/Global Modules
- \_lib
  - filter, interceptor, guard ...
  - service로 뺄 수 없는 전역적으로 사용하는 함수들이 위치하는 곳
- util
  - Resolver가 존재하지 않음
  - Service만 존재
  - 전역적으로 자주 사용하는 Service

### Env

- local: 각자 컴퓨터에서 띄운 개발환경 [ 기능추가, 버그수정 등등 수정한 코드 테스트용도 ]
- dev: 개발환경 [ 개발자 테스트용도 ]
- staging: 스테이징환경 [ Q/A (or) 베타테스트 용도 ]
- prod: 실서비스

### 환경별 설정

- 로깅: `prod`-custom format, `staging/dev/local`-'dev'
- 센트리, exceptionFilter: `prod/staging`-on, `dev/local`-off
- DB logging: `prod`-error,info,warn, `staging/dev`-error,warn `local`-all
