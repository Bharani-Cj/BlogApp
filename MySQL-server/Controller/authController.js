const { pool, hashedPassword, correctPassword } = require("../db");
const jwt = require("jsonwebtoken");

// CREATING TABLE USERS
(() => {
  const query = `CREATE TABLE IF NOT EXISTS users (
                      id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                      username VARCHAR(255) NOT NULL,
                    email VARCHAR(45) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    img VARCHAR(255) NULL
    
  )`;
  pool.query(query, (err, result) => {
    if (err) return console.log(err.message);

    // CREATING TABLE POSTS
    const query = `CREATE TABLE IF NOT EXISTS posts (
                          id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                          title VARCHAR(255) NOT NULL,
                          details VARCHAR(255) NOT NULL UNIQUE,
                          img VARCHAR(255) NULL,
                          date Date NOT NULL,
                          uid INT NOT NULL,
                          cat VARCHAR(100) NOT NULL,
                          FOREIGN KEY (uid) REFERENCES users(id)
                          )`;
    pool.query(query, (err, result) => {
      if (err) return console.log(err.message);
      console.log(`Table created`);
    });
  });
})();

exports.register = (req, res) => {
  // CHECK IF USER EXISTS
  const { username, email, password } = req.body;
  const query = `SELECT * FROM users WHERE email=? OR username=?`;
  pool.query(query, [email, username], async (err, result) => {
    if (err) return console.log(err.message);
    else if (result.length === 1)
      return res.status(200).json({
        status: 401,
        message: "User already exists",
      });

    // HASHING PASSWORD & CREATEING USER
    const hashPassword = await hashedPassword(password);
    const query = `INSERT INTO users (username,email,password) VALUES (?,?,?)`;

    // CREATING USER
    pool.query(query, [username, email, hashPassword], (err, result) => {
      if (err) return console.log(err);

      // SENDING SUCCESS MESSAGE
      res.status(200).json({ message: "User created successfully", result });
    });
  });
};

exports.login = (req, res) => {
  // CHECK USER
  const { username } = req.body;

  const query = `SELECT * FROM users WHERE username=?`;

  pool.query(query, [username], async (err, result) => {
    if (err) return console.log(err.message);

    // RETURN IF NO USER EXISTS
    if (result.length === 0)
      return res.status(404).json({
        status: "Fail",
        message: "User not found",
      });

    // CHECKING PASSWORD
    if (!(await correctPassword(req.body.password, result[0].password))) {
      return res.status(404).json({
        status: "Fail",
        message: "Wrong username or password",
      });
    }

    // GENERATING JWT TOKEN
    const token = jwt.sign({ id: result[0].id }, "jwtkey", { expiresIn: "5d" });

    // EXTRACTING PASSWORD
    const { password, ...other } = result[0];

    // SENDING SUCCESS RESULT WITH TOKEN
    res.status(200).json({
      other,
      token,
    });
  });
};

exports.logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json({
      message: "You have been logged out",
    });
};
