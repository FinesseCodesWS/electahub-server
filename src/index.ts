import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.send('ElectaHub API running'));

const PORT = process.env.PORT || 5432;
app.listen(PORT, () => console.log());
