
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './lib/db.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const CATEGORY_IDS = {
  HTML: 1,
  CSS: 2,
  JavaScript: 3,
};

async function seedData() {
  try {


    // 1. Read JSON files from your /data folder:
    const htmlData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'html.json'), 'utf8'));
    const cssData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'css.json'), 'utf8'));
    const jsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'js.json'), 'utf8'));

    await insertQuestionsAndAnswers(htmlData, CATEGORY_IDS.HTML);
    await insertQuestionsAndAnswers(cssData, CATEGORY_IDS.CSS);
    await insertQuestionsAndAnswers(jsData, CATEGORY_IDS.JavaScript);


    console.log('Data seeded successfully!');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await pool.end();
  }
}

async function insertQuestionsAndAnswers(fileData, categoryId) {

  if (!fileData.questions) {
    console.log(`Skipping ${fileData.title} because it has no questions array.`);
    return;
  }

  for (const q of fileData.questions) {
    // Check if "answers" is an array:
    if (!Array.isArray(q.answers)) {
      console.log(`Skipping question "${q.question}" because "answers" is not an array.`);
      continue;
    }

    // Insert the question
    const questionRes = await pool.query(
      `INSERT INTO questions (question, category_id)
       VALUES ($1, $2)
       RETURNING id`,
      [q.question, categoryId]
    );
    const questionId = questionRes.rows[0].id;

    // Insert each answer
    for (const ans of q.answers) {
      // If there's no .answer or .correct, skip or set defaults
      if (typeof ans.answer !== 'string') {
        console.log(`Skipping invalid answer for question ID ${questionId}.`);
        continue;
      }
      await pool.query(
        `INSERT INTO answers (answer, correct, question_id)
         VALUES ($1, $2, $3)`,
        [ans.answer, !!ans.correct, questionId]
      );
    }
  }
}

// Start the seed
seedData();
