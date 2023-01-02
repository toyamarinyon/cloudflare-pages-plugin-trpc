DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT,
  description TEXT,
  completion_datetime DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
DROP INDEX IF EXISTS idx_tasks_user_id;
CREATE INDEX idx_tasks_user_id ON tasks(user_id);


CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  github_user_id INTEGER NOT NULL,
  github_oauth_token TEXT NOT NULL
);
DROP INDEX IF EXISTS idx_users_github_user_id;
CREATE UNIQUE INDEX idx_users_github_user_id ON users(github_user_id);

CREATE TABLE sessions (
  id CHAR(64) PRIMARY KEY,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
DROP INDEX IF EXISTS idx_sessions_user_id;
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
