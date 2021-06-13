
-- DROP DATABASE IF EXISTS foodfyDB;
-- CREATE DATABASE foodfyDB;

CREATE TABLE chefs (
	id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT (now())
);

CREATE TABLE recipes (
	id SERIAL PRIMARY KEY,
  chef_id INT NOT NULL,
  image TEXT NOT NULL,
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
  recipe_id INTEGER REFERENCES recipes(id),
  file_id INTEGER REFERENCES files(id)
);