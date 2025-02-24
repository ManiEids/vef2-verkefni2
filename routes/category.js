
import { Router } from 'express';
import pool from '../lib/db.js';

const router = Router();

// Sýna spurningar og svör fyrir tiltekinn flokk
router.get('/:id', async (req, res) => {
  const categoryId = Number(req.params.id);
  if (!categoryId) {
    return res.status(400).render('error', { title: 'Villa', message: 'Ógilt ID fyrir flokk.' });
  }

  try {
    // Athuga hvort flokkur sé til
    const catResult = await pool.query('SELECT title FROM categories WHERE id = $1', [categoryId]);
    if (catResult.rowCount === 0) {
      return res.status(404).render('error', { title: 'Villa', message: 'Flokkur fannst ekki.' });
    }
    const categoryTitle = catResult.rows[0].title;

    // Sækja spurningar og svör
    const qaResult = await pool.query(`
      SELECT q.id AS question_id, q.question,
             a.id AS answer_id, a.answer, a.correct
      FROM questions q
      JOIN answers a ON q.id = a.question_id
      WHERE q.category_id = $1
      ORDER BY q.id, a.id
    `, [categoryId]);

    // Byggja gögn fyrir EJS (questions + answers)
    const questionMap = new Map();
    for (const row of qaResult.rows) {
      const qId = row.question_id;
      if (!questionMap.has(qId)) {
        questionMap.set(qId, {
          question: row.question,
          answers: [],
        });
      }
      questionMap.get(qId).answers.push({
        answer: row.answer,
        correct: row.correct,
      });
    }

    const categoryData = { questions: Array.from(questionMap.values()) };

    // Birta category.ejs
    res.render('category', {
      title: categoryTitle,
      categoryTitle,
      categoryData,
    });
  } catch (error) {
    res.status(500).render('error', { title: 'Villa', message: error.message });
  }
});

export default router;
