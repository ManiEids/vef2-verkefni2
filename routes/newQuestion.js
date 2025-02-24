import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Simple mapping from category ID to JSON file
const categoryMap = {
  '1': 'html.json',
  '2': 'css.json',
  '3': 'js.json',
};

// GET /new-question - Show the form
router.get('/', (req, res) => {
  // For now, we define categories in code
  // (Eventually, you'll read from DB or index.json)
  const categories = [
    { id: '1', title: 'HTML' },
    { id: '2', title: 'CSS' },
    { id: '3', title: 'JavaScript' },
  ];

  res.render('new-question', {
    title: 'Add a New Question',
    categories,
  });
});

// POST /new-question - Handle form submission
router.post('/', (req, res) => {
  const { question, category, answers } = req.body;

  // 1) Basic validation
  if (!question || question.length < 5) {
    return res.status(400).render('error', {
      title: 'Error',
      message: 'Question must be at least 5 characters long.',
    });
  }
  if (!categoryMap[category]) {
    return res.status(400).render('error', {
      title: 'Error',
      message: 'Invalid category selected.',
    });
  }
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).render('error', {
      title: 'Error',
      message: 'Answers are missing or invalid.',
    });
  }

  // 2) Prepare new question object
  // We expect categoryData.questions to be an array of question objects
  // Each question object might look like:
  // { question: 'Some question text', answers: [ { answer: '...', correct: 'true' }, ... ] }
  const newQuestion = {
    question,
    answers: answers.map(a => ({
      answer: a.answer,
      correct: a.correct === 'true', // convert 'true' or undefined to boolean
    })),
  };

  // 3) Read the corresponding JSON file
  const fileName = categoryMap[category]; // e.g. "html.json"
  let fileData;
  try {
    fileData = fs.readFileSync(path.join('./data', fileName), 'utf8');
  } catch (err) {
    return res.status(500).render('error', {
      title: 'Error',
      message: `Could not read file ${fileName}. ${err.message}`,
    });
  }

  // 4) Parse the existing JSON
  let categoryData;
  try {
    categoryData = JSON.parse(fileData);
  } catch (err) {
    return res.status(500).render('error', {
      title: 'Error',
      message: `Invalid JSON in ${fileName}. ${err.message}`,
    });
  }

  // Ensure categoryData.questions is an array
  if (!categoryData.questions || !Array.isArray(categoryData.questions)) {
    return res.status(500).render('error', {
      title: 'Error',
      message: `File ${fileName} has no valid 'questions' array.`,
    });
  }

  // 5) Add the new question
  categoryData.questions.push(newQuestion);

  // 6) Write the file back
  try {
    fs.writeFileSync(
      path.join('./data', fileName),
      JSON.stringify(categoryData, null, 2), // Prettify JSON with 2-space indentation
      'utf8'
    );
  } catch (err) {
    return res.status(500).render('error', {
      title: 'Error',
      message: `Could not write to file ${fileName}. ${err.message}`,
    });
  }

  // 7) Redirect to the category page
  // e.g. /category/html.json
  res.redirect(`/category/${fileName}`);
});

export default router;
