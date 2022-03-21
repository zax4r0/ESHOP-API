import bcrypt from 'bcrypt';
import supertest from 'supertest';
import request from 'supertest';
import App from '../app';
import { CreateUserDto } from '../dtos/users.dto';
import AuthRoute from '../routes/auth.routes';
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 7006));
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const userData: any = {
        email: 'test@email.com',
        name: {
          firstname: 'hello',
          lastname: 'hello',
        },
        password: 'q1w2e3r4',
      };

      const authRoute = new AuthRoute();
      const users = authRoute.authController.authService.users;

      users.findOne = jest.fn().mockReturnValue(null);
      users.create = jest.fn().mockReturnValue({
        id: '6230a945aeee1b5ab8417fd4',
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([authRoute]);
      return request(app.getServer()).post(`${authRoute.path}/signup`).send(userData).expect(201);
    });
  });

  describe('[POST] /login', () => {
    it('should return a signed accessToken & refresh token', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const authRoute = new AuthRoute();
      const users = authRoute.authController.authService.users;

      users.findOne = jest.fn().mockReturnValue({
        id: '6230a945aeee1b5ab8417fd4',
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([authRoute]);
      return await supertest(app.getServer()).post(`${authRoute.path}/login`).send(userData).expect(200);
    });
  });

  // describe('[POST] /logout', () => {
  //   it('logout Set-Cookie Authorization=; Max-age=0', async () => {
  //     const user: User = {
  //       id: 1,
  //       email: 'test@email.com',
  //       password: 'q1w2e3r4',
  //     };

  //     const authRoute = new AuthRoute();
  //     const users = authRoute.authController.authService.users;

  //     users.findFirst = jest.fn().mockReturnValue({
  //       ...user,
  //       password: await bcrypt.hash(user.password, 10),
  //     });

  //     const app = new App([authRoute]);
  //     return request(app.getServer())
  //       .post(`${authRoute.path}logout`)
  //       .expect('Set-Cookie', /^Authorization=\;/);
  //   });
  // });
});
