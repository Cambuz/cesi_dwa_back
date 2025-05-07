import express, { Request, Response } from 'express';
import cors from 'cors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3006;
const SECRET_KEY = process.env.ACCESS_JWT_KEY || "isEmptyJWT_KEY";

// Configuration CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

// Route d'authentification
app.post('/authenticate', (req: AuthenticatedRequest, res: Response): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader  || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Token manquant' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Token invalide' });
            return;
        }

        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        res.status(200).json({ status: 'success', user: decoded });
    } catch (err) {
        res.status(401).json({ error: 'Token expiré ou invalide' });
    }
});

app.listen(port, () => {
    console.log(`Auth service listening on port ${port}`);
}); 