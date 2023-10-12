CREATE TABLE users
(
    id       SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL
);

CREATE TABLE posts
(
    id      SERIAL PRIMARY KEY,
    title   VARCHAR(255) NOT NULL,
    body    TEXT         NOT NULL,
    user_id INTEGER REFERENCES users (id)
);

CREATE TABLE comments
(
    id      SERIAL PRIMARY KEY,
    body    TEXT NOT NULL,
    user_id INTEGER REFERENCES users (id),
    post_id INTEGER REFERENCES posts (id)
);

CREATE TABLE likes
(
    id      SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id),
    post_id INTEGER REFERENCES posts (id)
);
