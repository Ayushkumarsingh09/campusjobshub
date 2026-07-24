import 'dotenv/config';
import { validateEnvironment } from './lib/env';
validateEnvironment();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { logger } from './lib/logger';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import jobsRoutes from './routes/jobs.routes';
import internshipsRoutes from './routes/internships.routes';
import companiesRoutes from './routes/companies.routes';
import blogRoutes from './routes/blog.routes';
import searchRoutes from './routes/search.routes';
import roadmapsRoutes from './routes/roadmaps.routes';
import interviewQuestionsRoutes from './routes/interview-questions.routes';
import contentRoutes from './routes/content.routes';
import resumesRoutes from './routes/resumes.routes';
import atsRoutes from './routes/ats.routes';
import applicationsRoutes from './routes/applications.routes';
import savedJobsRoutes from './routes/saved-jobs.routes';
import savedCompaniesRoutes from './routes/saved-companies.routes';
import coverLettersRoutes from './routes/cover-letters.routes';
import careerDashboardRoutes from './routes/career-dashboard.routes';
import employerRoutes from './routes/employer.routes';
import newsletterRoutes from './routes/newsletter.routes';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT ?? 4000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';

app.set('trust proxy', 1);

app.use(
  pinoHttp({
    logger,
    autoLogging: process.env.NODE_ENV === 'production',
  })
);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const allowedOrigins = new Set([
  FRONTEND_URL,
  'https://campusjobshub.com',
  'https://www.campusjobshub.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      if (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const isProd = process.env.NODE_ENV === 'production';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: isProd ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
  skip: () => !isProd,
});

app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 30 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many auth attempts' } },
  skip: () => !isProd,
});

// API v1 routes
const api = express.Router();
api.use('/health', healthRoutes);
api.use('/auth', authLimiter, authRoutes);
api.use('/jobs', jobsRoutes);
api.use('/internships', internshipsRoutes);
api.use('/companies', companiesRoutes);
api.use('/blog', blogRoutes);
api.use('/search', searchRoutes);
api.use('/roadmaps', roadmapsRoutes);
api.use('/interview-questions', interviewQuestionsRoutes);
api.use('/content', contentRoutes);
api.use('/resumes', resumesRoutes);
api.use('/ats', atsRoutes);
api.use('/applications', applicationsRoutes);
api.use('/saved-jobs', savedJobsRoutes);
api.use('/saved-companies', savedCompaniesRoutes);
api.use('/cover-letters', coverLettersRoutes);
api.use('/career', careerDashboardRoutes);
api.use('/employer', employerRoutes);
api.use('/newsletter', newsletterRoutes);
api.use('/admin', adminRoutes);

app.use('/api/v1', api);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info({ port: PORT, env: process.env.NODE_ENV }, 'CampusJobsHub API started');
});

export default app;
