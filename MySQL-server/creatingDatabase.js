const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

connection.connect((err) => {
  const databaseName = `blog`;
  if (err) return console.log("Error connecting to MySQL:", err.message);

  // CREATING THE DATABASE
  connection.query(
    `CREATE DATABASE IF NOT EXISTS ${databaseName}`,
    (createErr) => {
      if (createErr) {
        console.error("Error creating database:", createErr);
      } else {
        console.log(`Database created: ${databaseName}`);
        // CLOSE THE MYSQL CONNECTION
        connection.end();
      }
    }
  );
});
