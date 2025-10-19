import express, { Request, Response } from 'express';
import { errorHandler } from './middleware/handleError';
import cors from 'cors';
import productRoutes from './routes/products.routes';

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors())
app.use(express.json())

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
