import express from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController.js';

const router = express.Router();
const controller = new AnalyticsController();

router.get('/', (req, res, next) => controller.getAnalytics(req, res, next));

export default router;