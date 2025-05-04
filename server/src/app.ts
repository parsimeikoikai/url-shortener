import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import shortLinkRoutes from './routes/shortLinkRoutes';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', shortLinkRoutes);

app.listen(4200, () => {
  console.log('> Ready on http://localhost:4200');
});

export default app;