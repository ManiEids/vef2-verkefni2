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

/* 1) Configure ejs-locals as our EJS engine */
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* 2) Parse URL-encoded bodies (useful for forms) */
app.use(express.urlencoded({ extended: true }));

/* 3) Serve static files from /public */
app.use(express.static(path.join(__dirname, 'public')));

/* 4) Mount your routers */
app.use('/', indexRouter);
app.use('/category', categoryRouter);
app.use('/new-question', newQuestionRouter);

/* 5) 404 handler */
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Page Not Found' });
});

/* 6) Start the server */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
