import express from 'express';
import {
  encodeUrl,
  decodeUrl,
  getStats,
  listUrls,
  redirectToOriginal,
} from '../controllers/shortLinkController';

const router = express.Router();

router.post('/api/encode', encodeUrl);
router.post('/api/decode', decodeUrl);
router.get('/api/statistic/:url_path', getStats);
router.get('/api/list', listUrls);
router.get('/:url_path', redirectToOriginal);

export default router;