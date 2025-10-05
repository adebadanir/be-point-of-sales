import { z } from 'zod';

const numberLike = z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
    .refine((val) => !isNaN(val), {
        message: 'Must be a valid number',
    });

export const createProductSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    price: numberLike.pipe(
        z.number().min(0, 'Price must be a positive number'),
    ),
    category: z.string().min(1, 'Category is required'),
    stock: numberLike.pipe(
        z.number().int().min(0, 'Stock must be a non-negative integer'),
    ),
    description: z.string().optional(),
    image: z.string().optional(),
    is_active: z.boolean().default(true),
});

export const updateProductSchema = z.object({
    name: z.string().min(1, 'Product name is required').optional(),
    price: numberLike
        .pipe(z.number().min(0, 'Price must be a positive number'))
        .optional(),
    category: z.string().min(1, 'Category is required').optional(),
    stock: numberLike
        .pipe(z.number().int().min(0, 'Stock must be a non-negative integer'))
        .optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    is_active: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
