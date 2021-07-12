
-- DROP DATABASE IF EXISTS foodfyDB;
-- CREATE DATABASE foodfyDB;

CREATE TABLE chefs (
	id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT (now())
);

CREATE TABLE recipes (
	id SERIAL PRIMARY KEY,
  chef_id INT NOT NULL,
  title TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  preparation TEXT[] NOT NULL,
  information text,
  created_at TIMESTAMP DEFAULT (now())
);

CREATE TABLE files (
	id SERIAL PRIMARY KEY,
  name TEXT,
  path TEXT NOT NULL
);

CREATE TABLE recipe_files (
	id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  file_id INTEGER REFERENCES files(id) ON DELETE CASCADE
);

/* ALTER TABLES */

ALTER TABLE chefs ADD COLUMN file_id INTEGER REFERENCES files(id);
ALTER TABLE recipes ADD COLUMN updated_at TIMESTAMP DEFAULT(now());

/* PROCEDURES AND TRIGGERS */

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();