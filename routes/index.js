
import { Router } from 'express';
import pool from '../lib/db.js';

const router = Router();

// Heimasíða (listar flokka)
router.get('/', async (req, res) => {
  try {
    // Sækja flokka úr gagnagrunni
    const result = await pool.query('SELECT id, title FROM categories ORDER BY id');
    const categories = result.rows;

    res.render('index', {
      title: 'Quiz Categories',
      categories,
    });
  } catch (error) {
    res.status(500).render('error', { title: 'Villa', message: error.message });
  }
});

export default router;
