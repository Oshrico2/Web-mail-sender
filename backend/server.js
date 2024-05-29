import path from "path";
import express from "express";
import bodyParser from 'body-parser'
import cors from 'cors';
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import agentsRoutes from './routes/agentsRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import employeeRoutes from './routes/employeesRoutes.js'
import programRoutes from './routes/programsRoutes.js'
import loginRoutes from './routes/loginRoutes.js'


dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));  // Increase limit to 50mb
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/api/agents',agentsRoutes);
app.use('/api/upload',uploadRoutes);
app.use('/api/employees',employeeRoutes);
app.use('/api/programs',programRoutes);
app.use('/api/login',loginRoutes);

app.get('/',(req,res) => {
  res.send("API is running...");
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      const user = await User.findOne({ username }); // Find user by username
      if (!user || !bcrypt.compareSync(password, user.password)) {
          return res.status(401).send({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.send(token);
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).send({ message: 'Internal server error' });
  }
});


const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname,'/uploads')));



app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
