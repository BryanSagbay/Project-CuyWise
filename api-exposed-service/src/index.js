import express from 'express';
import {PORT} from './config.js';
import pcwRoutes from './routes/pcws.routes.js';
import morgan from 'morgan';
import { swaggerUi, swaggerDocs } from './swagger.js';
import cors from 'cors';

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(pcwRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:'+ PORT);
}); 