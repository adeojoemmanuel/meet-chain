import { Router } from 'express';
import { createMeeting, scheduleMeeting } from '../controllers/meetingController';

const router = Router();

router.post('/create', createMeeting);
router.post('/schedule', scheduleMeeting);

export default router;
