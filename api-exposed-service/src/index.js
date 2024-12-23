import express from 'express';
import {PORT} from './config.js';
import pcwRoutes from './routes/pcws.routes.js';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(pcwRoutes);

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:'+ PORT);
}); 