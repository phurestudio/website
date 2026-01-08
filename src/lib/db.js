import mysql from "mysql2/promise";

let pool;

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: getRequiredEnv("DB_HOST"),
      port: Number(process.env.DB_PORT || 3306),
      user: getRequiredEnv("DB_USER"),
      password: getRequiredEnv("DB_PASSWORD"),
      database: getRequiredEnv("DB_NAME"),
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

export async function ensureTables() {
  const connection = getPool();

  await connection.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(191) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS games (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(191) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      tagline VARCHAR(255),
      banner VARCHAR(500),
      screenshots TEXT,
      youtube_url VARCHAR(600),
      playstore_url VARCHAR(600),
      steam_url VARCHAR(600),
      appstore_url VARCHAR(600),
      description LONGTEXT,
      platforms TEXT,
      features TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS news_posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(191) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      excerpt VARCHAR(600),
      game_slug VARCHAR(191),
      banner VARCHAR(600),
      screenshots TEXT,
      youtube_url VARCHAR(600),
      body LONGTEXT,
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Ensure newer columns exist when the table was created before they were added.
  try {
    await connection.query(`
      ALTER TABLE news_posts
      ADD COLUMN banner VARCHAR(600);
    `);
  } catch (err) {
    // Ignore duplicate column errors so older tables don't break.
    if (err?.code !== "ER_DUP_FIELDNAME") {
      throw err;
    }
  }

  try {
    await connection.query(`
      ALTER TABLE news_posts
      ADD COLUMN screenshots TEXT;
    `);
  } catch (err) {
    if (err?.code !== "ER_DUP_FIELDNAME") {
      throw err;
    }
  }

  try {
    await connection.query(`
      ALTER TABLE games
      ADD COLUMN screenshots TEXT;
    `);
  } catch (err) {
    if (err?.code !== "ER_DUP_FIELDNAME") {
      throw err;
    }
  }

  try {
    await connection.query(`
      ALTER TABLE news_posts
      ADD COLUMN game_slug VARCHAR(191);
    `);
  } catch (err) {
    if (err?.code !== "ER_DUP_FIELDNAME") {
      throw err;
    }
  }

  try {
    await connection.query(`
      ALTER TABLE games
      ADD COLUMN youtube_url VARCHAR(600);
    `);
  } catch (err) {
    if (err?.code !== "ER_DUP_FIELDNAME") {
      throw err;
    }
  }

  try {
    await connection.query(`
      ALTER TABLE games
      ADD COLUMN playstore_url VARCHAR(600);
    `);
  } catch (err) {
    if (err?.code !== "ER_DUP_FIELDNAME") {
      throw err;
    }
  }

  try {
    await connection.query(`
      ALTER TABLE games
      ADD COLUMN steam_url VARCHAR(600);
    `);
  } catch (err) {
    if (err?.code !== "ER_DUP_FIELDNAME") {
      throw err;
    }
  }

  try {
    await connection.query(`
      ALTER TABLE games
      ADD COLUMN appstore_url VARCHAR(600);
    `);
  } catch (err) {
    if (err?.code !== "ER_DUP_FIELDNAME") {
      throw err;
    }
  }

  try {
    await connection.query(`
      ALTER TABLE news_posts
      ADD COLUMN youtube_url VARCHAR(600);
    `);
  } catch (err) {
    if (err?.code !== "ER_DUP_FIELDNAME") {
      throw err;
    }
  }

  // Migrate legacy columns when present, then remove them.
  try {
    await connection.query(`
      UPDATE news_posts
      SET banner = COALESCE(banner, image)
      WHERE banner IS NULL AND image IS NOT NULL;
    `);
  } catch (err) {
    if (err?.code !== "ER_BAD_FIELD_ERROR") {
      throw err;
    }
  }

  try {
    await connection.query(`
      UPDATE news_posts
      SET screenshots = COALESCE(screenshots, images)
      WHERE screenshots IS NULL AND images IS NOT NULL;
    `);
  } catch (err) {
    if (err?.code !== "ER_BAD_FIELD_ERROR") {
      throw err;
    }
  }

  try {
    await connection.query(`
      ALTER TABLE news_posts
      DROP COLUMN image;
    `);
  } catch (err) {
    if (err?.code !== "ER_BAD_FIELD_ERROR") {
      throw err;
    }
  }

  try {
    await connection.query(`
      ALTER TABLE news_posts
      DROP COLUMN images;
    `);
  } catch (err) {
    if (err?.code !== "ER_BAD_FIELD_ERROR") {
      throw err;
    }
  }
}
