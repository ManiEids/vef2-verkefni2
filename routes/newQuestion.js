// routes/newQuestion.js
import { Router } from 'express';
import pool from '../lib/db.js';
import xss from 'xss';

const router = Router();

// Birtir form fyrir nýja spurningu (GET)
router.get('/', async (req, res) => {
  try {
    // Sækir flokka úr gagnagrunni
    const catRes = await pool.query('SELECT id, title FROM categories ORDER BY id');
    const categories = catRes.rows;

    res.render('new-question', {
      title: 'Add a New Question',
      categories,
    });
  } catch (error) {
    res.status(500).render('error', { title: 'Villa', message: error.message });
  }
});

// Vinnur úr formgögnum (POST)
router.post('/', async (req, res) => {
  const { question, category, answers } = req.body;
  const sanitizedQuestion = xss(question);

  let sanitizedAnswers = [];
  if (Array.isArray(answers)) {
    sanitizedAnswers = answers.map((a) => ({
      answer: xss(a.answer),
      correct: a.correct === 'true',
    }));
  }

  // Einföld staðfesting
  if (!sanitizedQuestion || sanitizedQuestion.length < 5) {
    return res.status(400).render('error', {
      title: 'Villa',
      message: 'Spurning þarf að vera að lágmarki 5 stafir.',
    });
  }
  if (!category) {
    return res.status(400).render('error', {
      title: 'Villa',
      message: 'Enginn flokkur valinn.',
    });
  }
  if (sanitizedAnswers.length < 2) {
    return res.status(400).render('error', {
      title: 'Villa',
      message: 'Að minnsta kosti 2 svör þarf að skrá.',
    });
  }

  try {
    // Athugar hvort flokkur sé gildur
    const catCheck = await pool.query('SELECT id FROM categories WHERE id = $1', [category]);
    if (catCheck.rowCount === 0) {
      return res.status(400).render('error', {
        title: 'Villa',
        message: 'Ógilt flokks-ID.',
      });
    }

    // Setur spurningu í gagnagrunn
    const qRes = await pool.query(
      `INSERT INTO questions (question, category_id)
       VALUES ($1, $2)
       RETURNING id`,
      [sanitizedQuestion, category]
    );
    const questionId = qRes.rows[0].id;

    // Setur svör í gagnagrunn
    for (const a of sanitizedAnswers) {
      if (!a.answer) continue;
      await pool.query(
        `INSERT INTO answers (answer, correct, question_id)
         VALUES ($1, $2, $3)`,
        [a.answer, a.correct, questionId]
      );
    }

    // Áframsendir á síðu flokks
    res.redirect(`/category/${category}`);
  } catch (error) {
    res.status(500).render('error', { title: 'Villa', message: error.message });
  }
});

export default router;
