require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const helmet = require('helmet');
const db = require('./config/db');

if (process.env.NODE_ENV === 'production' && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) {
  throw new Error('SESSION_SECRET must be set to at least 32 characters in production.');
}
const app = express();
const port = Number(process.env.PORT || 3000);
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit:'20kb' }));
app.use(express.urlencoded({ extended:false, limit:'20kb' }));

const sessionOptions = {
  host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodiehub_db', createDatabaseTable:true,
  schema: { tableName:'sessions', columnNames:{ session_id:'session_id', expires:'expires', data:'data' } }
};
const store = new MySQLStore(sessionOptions);
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);
app.use(session({
  name:'foodiehub.sid', secret:process.env.SESSION_SECRET || 'local-dev-only-change-this-secret-before-deploying',
  store, resave:false, saveUninitialized:false,
  cookie:{ httpOnly:true, sameSite:'lax', secure:process.env.NODE_ENV === 'production', maxAge:7*24*60*60*1000 }
}));

app.use('/api/foods', require('./routes/foodRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use(express.static(path.join(__dirname), { extensions:['html'] }));
app.get('/', (req,res) => res.sendFile(path.join(__dirname,'index.html')));
app.use('/api', (req,res) => res.status(404).json({error:'API endpoint not found.'}));
app.use((error,req,res,next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  const dbError = error.code && error.code.startsWith('ER_');
  res.status(dbError ? 503 : 500).json({error:dbError ? 'Database request failed. Check the MySQL setup and try again.' : 'Something went wrong. Please try again.'});
});

async function start() {
  try {
    await db.query('SELECT 1');
    app.listen(port, () => console.log(`FoodieHub is running at http://localhost:${port}`));
  } catch (error) {
    console.error('Could not connect to MySQL. Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD and run database/schema.sql.');
    console.error(error.message);
    process.exitCode = 1;
  }
}
start();
