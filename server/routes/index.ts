import express from 'express';
import { aggregateController } from '../controllers';

const appRoutes = express.Router();

appRoutes.post("", aggregateController.aggregate);

export default appRoutes;