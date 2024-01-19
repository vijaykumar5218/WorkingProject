const express = require('express');
const join = require('path').join;
const app = express();

const port = process.env.PORT || 3000;

const DIST_FOLDER = join(process.cwd(), 'server/dist');

const myvoyageRouter = express.Router();

app.use('*/apple-app-site-association', (_, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

myvoyageRouter.get('*/apple-app-site-association', express.static(DIST_FOLDER));

myvoyageRouter.get('*.*', express.static(DIST_FOLDER));

myvoyageRouter.get('*', (req, res) => {
  res.sendFile(join(DIST_FOLDER, 'myvoyageui/index.html'));
});

app.use('', myvoyageRouter);

app.listen(port);
