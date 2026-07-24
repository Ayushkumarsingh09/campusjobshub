import { Router } from 'express';
import { adminAuth } from '../../middleware/admin';
import dashboardRoutes from './dashboard.routes';
import jobsRoutes from './jobs.routes';
import internshipsRoutes from './internships.routes';
import companiesRoutes from './companies.routes';
import blogRoutes from './blog.routes';
import roadmapsRoutes from './roadmaps.routes';
import interviewQuestionsRoutes from './interview-questions.routes';
import usersRoutes from './users.routes';
import newsletterRoutes from './newsletter.routes';
import seoRoutes from './seo.routes';
import mediaRoutes from './media.routes';
import settingsRoutes from './settings.routes';
import categoriesRoutes from './categories.routes';
import tagsRoutes from './tags.routes';

const router = Router();

router.use(adminAuth);

router.use('/dashboard', dashboardRoutes);
router.use('/jobs', jobsRoutes);
router.use('/internships', internshipsRoutes);
router.use('/companies', companiesRoutes);
router.use('/blog', blogRoutes);
router.use('/roadmaps', roadmapsRoutes);
router.use('/interview-questions', interviewQuestionsRoutes);
router.use('/users', usersRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/seo', seoRoutes);
router.use('/media', mediaRoutes);
router.use('/settings', settingsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/tags', tagsRoutes);

export default router;
