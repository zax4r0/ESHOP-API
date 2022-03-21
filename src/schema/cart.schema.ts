import { object, string, TypeOf } from 'zod';
const payload = {
  body: object({
    productId: string({
      required_error: 'productId is required',
    }),
  }).strict(),
};

const cartId = {
  params: object({
    id: string({
      required_error: 'cartId is required',
    }),
  }).strict(),
};
const userId = {
  params: object({
    userId: string({
      required_error: 'userId is required',
    }),
  }).strict(),
};

export const createCartSchema = object({
  ...payload,
});

export const updateCartSchema = object({
  ...payload,
  ...cartId,
});

export const deleteCartSchema = object({
  ...payload,
});

export const getCartSchema = object({
  ...cartId,
});

export const getCartByUserSchema = object({
  ...userId,
});

export type CreateCartInput = TypeOf<typeof createCartSchema>;
export type UpdateCartInput = TypeOf<typeof updateCartSchema>;
export type ReadCartInput = TypeOf<typeof getCartSchema>;
export type ReadCartByUserInput = TypeOf<typeof getCartByUserSchema>;
export type DeleteCartInput = TypeOf<typeof deleteCartSchema>;
