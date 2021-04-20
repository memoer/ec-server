# test before push

- 만약 coverage가 80% 미만이라면 git push 불가

# 테스트할 파일들 (설정)

```json
"collectCoverageFrom": [
  "**/*.service.(t|j)s",
  "lib/**/*.(t|j)s"
],
```

# 테스트하는 코드들

### service

- 로직이 제일 많은 부분
- 테스트 필수

### lib

- 각각의 서비스에서 가져다가 쓰는 곳
- 로직이 존재
- filter/interceptor ... 등등 이런 파일도 이 폴더에 존재함

# 테스트를 안하는 것들 과 안해도 된다고 생각하는 이유

### module

- 로직이 아예 없는 곳
- 테스트할 필요 없다 생각함

### resolver

- e2e test로 진행
- 로직이 어차피 별로 없음
- 로직은 service에 있음

### @\*\*

- Required/Global Modules
- service, resolver가 없는 module
- 설정 모듈들임 ( config, database, graphql) -> 테스트를 할 필요가 없다 생각함 -> 설정부분이기 떄문에
  - 어차피 설정이 잘못 되었다면 앱이 실행조차 안됨
