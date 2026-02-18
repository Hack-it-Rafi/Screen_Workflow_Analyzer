import { Router } from 'express';
import { UserRoutes } from '../Modules/User/User.route';

const router = Router();

const moduleRoutes = [
  
  {
    path: '/user',
    //http://localhost:3000/api/v1/user
    route: UserRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;