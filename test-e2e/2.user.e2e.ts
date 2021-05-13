import { User } from '~/user/entity';
import { MockApp } from './config';
import { QueryAll } from './config/type';
// ! createUser, sendVerifyCodeUser, checkVerifyCodeUser 불가능
// ! updateUser -> phoneNumber, email 불가능 ( 인증코드를 받아야 함 )
// ? me, logInUser, findAllUser, findOneUser, updateUser, removeUser, resotreUser test
export default (mockApp: MockApp) =>
  describe('UserResolver (e2e)', () => {
    it(mockApp.getDesc('query', 'logInUser'), () =>
      mockApp
        .testData({
          query: `{
        logInUser(input:{phoneNumber:"${mockApp.user.phoneNumber}", password:"${mockApp.user.password}"})
      }`,
        })
        .sendGql()
        .expect((res) => {
          const token = mockApp.getDataFromBody<string>(res, 'logInUser');
          expect(token).toEqual(expect.any(String));
          mockApp.token = token;
        }),
    );

    it(mockApp.getDesc('query', 'me'), () =>
      mockApp
        .testData({
          includeToken: true,
          query: `{
        me {
          id
          phoneNumber
          nickname
          sex
          birthDate
          email
          thumbnail
        }
      }`,
        })
        .sendGql()
        .expect((res) => {
          const {
            id,
            phoneNumber,
            nickname,
            sex,
            birthDate,
            email,
            thumbnail,
          } = mockApp.getDataFromBody<User>(res, 'me');
          expect(id).toEqual(mockApp.user.id);
          expect(phoneNumber).toEqual(mockApp.user.phoneNumber);
          expect(nickname).toEqual(expect.anyOrNull(String));
          expect(sex).toEqual(expect.any(String));
          expect(birthDate).toEqual(expect.any(String));
          expect(email).toEqual(expect.anyOrNull(String));
          expect(thumbnail).toEqual(expect.anyOrNull(String));
          mockApp.updateUser({ nickname, sex, birthDate, email, thumbnail });
        }),
    );

    it(mockApp.getDesc('query', 'findAllUser'), () =>
      mockApp
        .testData({
          query: `{
          findAllUser(input:{}){
            data{
              id
              phoneNumber
              nickname
              sex
              birthDate
              email
              thumbnail
            }
            curPage
            totalPage
            hasNextPage
          }
        }`,
        })
        .sendGql()
        .expect((res) => {
          const {
            data,
            curPage,
            totalPage,
            hasNextPage,
          } = mockApp.getDataFromBody<QueryAll<User>>(res, 'findAllUser');
          expect(data).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
                phoneNumber: expect.any(String),
                nickname: expect.any(String),
                sex: expect.any(String),
                birthDate: expect.any(String),
                email: expect.anyOrNull(String),
                thumbnail: expect.anyOrNull(String),
              }),
            ]),
          );
          expect(curPage).toEqual(expect.any(Number));
          expect(totalPage).toEqual(expect.any(Number));
          expect(hasNextPage).toEqual(expect.any(Boolean));
        }),
    );

    it(mockApp.getDesc('query', 'findOneUser'), () =>
      mockApp
        .testData({
          query: `{
  findOneUser(input: { id: ${mockApp.user.id} }) {
    id
    phoneNumber
    nickname
    sex
    birthDate
    email
    thumbnail
  }
}`,
        })
        .sendGql()
        .expect((res) => {
          const {
            id,
            phoneNumber,
            nickname,
            sex,
            birthDate,
            email,
            thumbnail,
          } = mockApp.getDataFromBody<User>(res, 'findOneUser');
          expect(id).toEqual(mockApp.user.id);
          expect(phoneNumber).toEqual(mockApp.user.phoneNumber);
          expect(nickname).toEqual(expect.anyOrNull(String));
          expect(sex).toEqual(expect.any(String));
          expect(birthDate).toEqual(expect.any(String));
          expect(email).toEqual(expect.anyOrNull(String));
          expect(thumbnail).toEqual(expect.anyOrNull(String));
        }),
    );

    it(mockApp.getDesc('mutation', 'updateUser'), () =>
      mockApp
        .testData({ query: `` })
        .sendGql()
        .expect((res) => {
          const {
            id,
            phoneNumber,
            nickname,
            sex,
            birthDate,
            email,
            thumbnail,
          } = mockApp.getDataFromBody<User>(res, 'updateUser');
          expect(id).toEqual(mockApp.user.id);
          expect(phoneNumber).toEqual(mockApp.user.phoneNumber);
          expect(nickname).toEqual(expect.anyOrNull(String));
          expect(sex).toEqual(expect.any(String));
          expect(birthDate).toEqual(expect.any(String));
          expect(email).toEqual(expect.anyOrNull(String));
          expect(thumbnail).toEqual(expect.anyOrNull(String));
        }),
    );
  });
//  updateUser, removeUser, resotreUser test
