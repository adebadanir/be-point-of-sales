import { Router } from 'express';
import { ProductController } from '../controllers/products.controller';

const router = Router();

router.get('/', ProductController.getAllProducts);

router.get('/:id', ProductController.getProductById);

router.post('/', ProductController.createProduct);

router.put('/:id', ProductController.updateProduct);

router.patch('/:id/quantity', ProductController.updateProductQuantity);

router.delete('/:id', ProductController.deleteProduct);

export default router;
