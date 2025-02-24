import { Router } from 'express';
import fs from 'fs';

const router = Router();

router.get('/', (req, res) => {
  try {
    // Read and parse index.json
    const data = fs.readFileSync('./data/index.json', 'utf8');
    const categories = JSON.parse(data);

    // Filter valid categories
    const validCategories = categories.filter(cat => cat.title && cat.file);

    res.render('index', {
      title: 'Quiz Categories',
      categories: validCategories,
    });
  } catch (error) {
    res.status(500).render('error', { title: 'Error', message: error.message });
  }
});

export default router;
