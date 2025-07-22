import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/auth.user';
import authRoutes from './routes/auth.routes';
import electionRoutes from './routes/election.routes';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', authRoutes);
app.use('/api/auth', authRoutes);


app.get('/', (_, res) => res.send('Bingo! ElectaHub API running'));

const PORT = process.env.PORT || 5432;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use('/api/users', userRoutes);
app.use('/api/elections', electionRoutes);