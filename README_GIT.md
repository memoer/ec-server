# Folder Naming Rules

- @\*\*: Required/Global Modules
- \_lib: No Module (filter, interceptor, guard ... )
- util: Util Module ( commonly used logic )

# Milestones

- 제일 큰 프로젝트
- 무조건 해당 `Milestone` 에 관계가 있는 `Issue`들만 작성할 것
- 공통된 하나의 `Milestone`을 가진 `Issue` 들은 서로 다른 `Project`들을 가질 수 있다.

- 여러 개의 `Project` 가 하나의 `Milestone` 를 향하여 가는 것.

# Commit&Push Process

1. `./git-checkout-b.sh <feat|fix|chore|refactor> <ISSUE_NUMBER>`
2. `git add .`
3. `git commit`
4. commit category 선택 -> `[1]feat [2]fix [3]docs [4]refactor [5]test [6]chore`
5. 해당 issue에 적힌 to do 하나 선택 -> `related to do on the issue :`
   - 관련된 것이 없으면 숫자 외 입력 (예: "a")
6. branch에 적힌 `ISSUE_NUMBER` 와 위에서 적은 `TO_DO_NUMBER`가 합쳐져서 commit message가 작성됨 → `chore(#2_$4): ...`
7. branch 규칙 / commit 규칙이 맞다면 정상적으로 commit 된다.
8. push하기 전 `npm run test:cov` 가 실행된다
9. 설정해놓은 `coverage threshold` 에 부합하지 않다면 push가 진행되지 않는다.

# Branch Rules

- `git flow` 정책을 따릅니다.
- `.husky/pre-commit` 를 통해 branch name validation을 합니다.

### Branch Name

- `master`
- `release`
- `develop`
- `feat/#<ISSUE_NUMBER>`
- `fix/#<ISSUE_NUMBER>`
- `chore/#<ISSUE_NUMBER>`
  - 기능추가/기능버그수정 제외한 코드 수정일 경우
  - 가장 이상적 -> chore, docs commit message만 존재
- `refactor/#<ISSUE_NUMBER>`
  - **리팩토링만** 할 경우, 사용하는 branch

# Commit Rules

- [Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
- `.husky/commit-msg` 를 통해 commit message validation을 합니다.
- `.husky/prepare-commit-msg`를 통해 branch name을 기반으로 commit message를 자동으로 만들어줍니다.
- 각 issue 내부에는 TO_DO_LIST가 존재, 해당 리스트에 적혀진 하나하나를 `MESSAGE`로 적습니다.

### Commit Message

- `feat(#<ISSUE_NUMBER>(_$<TO_DO_NUMBER>)?): MESSAGE`
  - new feature for the user, not a new feature for build script
- `fix(#<ISSUE_NUMBER>(_$<TO_DO_NUMBER>)?): MESSAGE`
  - bug fix for the user, not a fix to a build script
- `docs(#<ISSUE_NUMBER>(_$<TO_DO_NUMBER>)?): MESSAGE`
  - changes to the documentation
- `refactor(#<ISSUE_NUMBER>(_$<TO_DO_NUMBER>)?): MESSAGE`
  - refactoring production code, eg. renaming a variable
  - 코드 리팩토링
- `test(#<ISSUE_NUMBER>(_$<TO_DO_NUMBER>)?): MESSAGE`
  - adding missing tests, refactoring tests; no production code change
  - 테스트 코드 작성
- `chore(#<ISSUE_NUMBER>(_$<TO_DO_NUMBER>)?): MESSAGE`
  - updating grunt tasks etc; no production code change
  - **(코드변경없음)** 빌드업무수정, 패키지 매니저 수정, 환경설정, 기타등등
