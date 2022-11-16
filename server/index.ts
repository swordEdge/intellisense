import express from 'express';

import {
    backendSetup,
} from './setup';

const app = express();

backendSetup(app);