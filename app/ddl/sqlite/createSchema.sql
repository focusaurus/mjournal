create table users (
  id integer primary key autoincrement,
  email varchar(256) not null unique,
  bcryptedPassword varchar(256)
);
