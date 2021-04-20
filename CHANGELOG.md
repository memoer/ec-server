| 1.x.x    | x.1.x    | x.x.1          |
| -------- | -------- | -------------- |
| 알파버전 | 기능추가 | 버그수정, 설정 |

---

## 0.0.2 (April 20, 2021)\_기록용 태깅 [ git태깅은 안 함 ]

### validate git commit, branch name

- `commitlint` 를 사용하여 commit message 유효성 검사
- `.husky/pre-commit` git hook을 사용하여 commit하기 전, branch name 검사
- `.husky/prepare-commit-msg` git hook을 사용하여 commit message 자동 생성
  - branch name이 feat/#13 이라면, 만들어진 commit message은 `feat(#13): ` 이다.
  - commit 하기 전, 해당 commit category를 선택함 `[1]feat[2]fix[3]docs[4]refactor[5]test[6]chore`

## 0.0.1 (April 20, 2021)\_기록용 태깅 [ git태깅은 안 함 ]

### 기본 개발환경 셋팅

- local/dev/staging/prod 환경에서 `local` 환경 셋팅
- config, database(TypeORM), graphql modele 셋팅
- logging(morgan), sentry(error capture), helmet(for security), csurf(for security), compression 미들웨어 추가
- local환경 docker-compose 설정
