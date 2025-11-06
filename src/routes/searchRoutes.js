import express from 'express';
import { SearchController } from '../controllers/SearchController.js';

const router = express.Router();
const controller = new SearchController();

router.get('/', (req, res, next) => controller.search(req, res, next));

export default router;