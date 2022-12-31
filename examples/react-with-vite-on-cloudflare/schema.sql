DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  completion_datetime DATETIME
);

DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  github_user_id INTEGER NOT NULL,
  github_oauth_token TEXT NOT NULL
);
DROP INDEX IF EXISTS idx_users_github_user_id;
CREATE UNIQUE INDEX idx_users_github_user_id ON users(github_user_id);
INSERT INTO users (github_user_id, github_oauth_token) VALUES (1, 'abc123');

CREATE TABLE sessions (
  id CHAR(64) PRIMARY KEY,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
DROP INDEX IF EXISTS idx_sessions_user_id;
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
INSERT INTO sessions (id, user_id) VALUES ('df2fd589-c155-455b-a48f-d50bd51b3c32', 1);


