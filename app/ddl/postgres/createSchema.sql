--create sequence userssequence;
create table "users" (
  "id" serial,
  "email" varchar(256) not null unique,
  "bcryptedPassword" char(60) not null
);
