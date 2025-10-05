import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import {
    createProductSchema,
    updateProductSchema,
} from '../models/products.model';
import { ZodError } from 'zod';

const prisma = new PrismaClient();

export class ProductController {
    static async getAllProducts(req: Request, res: Response) {
        try {
            const { category, status, search } = req.query;

            const where: any = {
                deleted_at: null,
            };

            if (category) {
                where.category = category as string;
            }

            if (status) {
                where.status = status as string;
            }

            if (search) {
                where.OR = [
                    {
                        name: {
                            contains: search as string,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: search as string,
                            mode: 'insensitive',
                        },
                    },
                ];
            }

            const products = await prisma.products.findMany({
                where,
                orderBy: { created_at: 'desc' },
            });

            res.status(200).json({
                success: true,
                data: products,
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch products',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    static async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const product = await prisma.products.findFirst({
                where: {
                    id,
                    deleted_at: null,
                },
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }

            res.status(200).json({
                success: true,
                data: product,
            });
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch product',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    static async createProduct(req: Request, res: Response) {
        try {
            const validatedData = createProductSchema.parse(req.body);

            const product = await prisma.products.create({
                data: {
                    ...validatedData,
                    name: validatedData.name,
                    price: Number(validatedData.price),
                    category: validatedData.category,
                    description: validatedData.description || '',
                    image: validatedData.image || '',
                    stock: validatedData.stock,
                    is_active: validatedData.is_active,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: product,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error,
                });
            }

            console.error('Error creating product:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create product',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    static async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const validatedData = updateProductSchema.parse(req.body);

            const existingProduct = await prisma.products.findFirst({
                where: {
                    id,
                    deleted_at: null,
                },
            });

            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }

            const product = await prisma.products.update({
                where: { id },
                data: {
                    ...validatedData,
                    name: validatedData.name,
                    description: validatedData.description || '',
                    image: validatedData.image || '',
                    price: Number(validatedData.price),
                    stock: validatedData.stock,
                    updated_at: new Date(),
                },
            });

            res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                data: product,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error,
                });
            }

            console.error('Error updating product:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update product',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const existingProduct = await prisma.products.findFirst({
                where: {
                    id,
                    deleted_at: null,
                },
            });

            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }

            await prisma.products.update({
                where: { id },
                data: { deleted_at: new Date() },
            });

            res.status(200).json({
                success: true,
                message: 'Product deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete product',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    static async updateProductQuantity(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { stock } = req.body;

            if (typeof stock !== 'number' || stock < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid quantity value',
                });
            }

            const product = await prisma.products.update({
                where: { id },
                data: { stock },
            });

            res.status(200).json({
                success: true,
                message: 'Product quantity updated successfully',
                data: product,
            });
        } catch (error) {
            console.error('Error updating product quantity:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update product quantity',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}
