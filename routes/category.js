import { Router } from 'express';
import fs from 'fs';

const router = Router();

// GET /category/:file
router.get('/:file', (req, res) => {
  const fileName = req.params.file;

  try {
    // Read the file (e.g. "html.json" or "corrupt.json")
    const data = fs.readFileSync(`./data/${fileName}`, 'utf8');
    const categoryData = JSON.parse(data);

    // Validate that categoryData.questions is an array
    if (!categoryData || !Array.isArray(categoryData.questions)) {
      throw new Error('Invalid category data: "questions" must be an array.');
    }

    // Derive a page title from file name (e.g. "html" from "html.json")
    const categoryTitle = fileName.replace('.json', '');

    res.render('category', {
      title: categoryTitle,
      categoryTitle,
      categoryData,
    });
  } catch (error) {
    // If the file is missing, or JSON is invalid, or data is corrupt:
    res.status(500).render('error', { title: 'Error', message: error.message });
  }
});

export default router;
