const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { JWT_SECRET } = process.env;

const app = express();
const port = 3000;

// 中间件
app.use(bodyParser.json());

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('password123', 10) // 使用 bcrypt 加密密码
  }
];

// 注册接口
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword
  };

  users.push(newUser);
  res.send({ message: 'User registered successfully' });
});

// 登录接口
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }

  // 生成 JWT
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

  res.send({ message: 'Login successful', token });
});

// 验证 JWT 的中间件
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden' });
    }

    req.user = user;
    next();
  });
};

// 获取用户信息接口
app.get('/profile', authenticateToken, (req, res) => {
  res.send({ message: 'Welcome to your profile', user: req.user.username });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
