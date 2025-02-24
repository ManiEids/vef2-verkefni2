
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import engine from 'ejs-locals';

import indexRouter from './routes/index.js';
import categoryRouter from './routes/category.js';
import newQuestionRouter from './routes/newQuestion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Stilla ejs-locals (styður layout)
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Meðhöndla (POST gögn)
app.use(express.urlencoded({ extended: true }));

// Þjónusta static skrár úr /public
app.use(express.static(path.join(__dirname, 'public')));

// Setja upp routes
app.use('/', indexRouter);
app.use('/category', categoryRouter);
app.use('/new-question', newQuestionRouter);

// 404 meðhöndlun
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Fannst ekki' });
});

// Keyra server
app.listen(PORT, () => {
  console.log(`Server keyrir á http://localhost:${PORT}`);
});
