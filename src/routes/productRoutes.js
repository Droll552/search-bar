import express from 'express';
import { ProductController } from '../controllers/ProductController.js';

const router = express.Router();
const controller = new ProductController();

router.post('/', (req, res, next) => controller.createProduct(req, res, next));

export default router;
