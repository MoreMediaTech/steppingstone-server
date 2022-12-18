import { Router } from 'express';

import { analyticsController } from '../controllers/analytics.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.route('/').get(protect, analyticsController.getAnalytics);
router.route('/add-online-user').post(protect, analyticsController.addOnlineUser);
router.route('/viewed').post(protect, analyticsController.viewed);
router.route('/record-load-times').post(protect, analyticsController.recordLoadTimes);

export {router}