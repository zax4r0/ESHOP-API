import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    name: object({
      firstname: string({
        required_error: 'firstname is required',
      }),
      lastname: string({
        required_error: 'flastnameirstname is required',
      }),
    }),
    password: string({
      required_error: 'password is required',
    }).min(6, 'Password too short - should be 6 chars minimum'),
    passwordConfirmation: string({
      required_error: 'passwordConfirmation is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
  })
    .strict()
    .refine(data => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match',
      path: ['passwordConfirmation'],
    }),
});

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, 'body.passwordConfirmation'>;
