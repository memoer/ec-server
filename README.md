# End Communiy - www.ec.com

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

### Branch Rules

- deploy/<BRANCH_NAME>
- fix/<BRANCH_NAME>
- feat/<BRANCH_NAME>
- refactor/<BRANCH_NAME>
- chore/<BRANCH_NAME>
- style/<BRANCH_NAME>
- test/<BRANCH_NAME>
- hotfix/<BRANCH_NAME>

### Commit Rules

- deploy: 🚀 [title]: 배포 진행 시 사용
- feat: ⚡️ [title]: 새로운 기능이 추가될 경우 사용
- fix: 🐛 [title]: 긴급한 버그 수정 시 사용
- refactor: 🛠 [title]: 코드 리팩토링 시 사용
- chore: 📦 [title]: 소스를 제외한 나머지 파일에 수정사항이 있을 경우 사용
- test: 🔍 [title]: test code 작성 시 사용

### Tag Rules

- 1.x.x: 메인업그레이드 / 개편 (or) 서버 전체 코드 변경
- x.1.x: 기능추가 / 새 기능 추가
- x.x.1: 버그수정, 리팩토링...

### Env

- development: 개발환경 [ 개발자 테스트용도 ]
- staging: 스테이징환경 [ Q/A 용도 ]
- production: 실서비스
