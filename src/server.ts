import App from '@/app';
import AuthRoute from '@/routes/auth.routes';
import IndexRoute from '@/routes/index.routes';
import UsersRoute from '@/routes/users.routes';
import validateEnv from '@/utils/validateEnv';
import CartRoute from '@/routes/cart.routes';
import ProductsRoute from '@/routes/product.routes';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new CartRoute(), new ProductsRoute()]);

app.listen();
