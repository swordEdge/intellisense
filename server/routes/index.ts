// import node moduels
import express from 'express';

// import controller
import { intelliController } from '../controllers';

const appRoutes = express.Router();
console.log('safsadfsadfasdf')
appRoutes.post("", intelliController.calculate);

export default appRoutes;