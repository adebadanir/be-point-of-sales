import express, { Request, Response } from 'express';
import cors from 'cors';
import productRoutes from './routes/products.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/products', productRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});
