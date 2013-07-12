create table if not exists "users" (
  "id" serial primary key,
  "email" varchar(256) not null unique,
  "bcryptedPassword" char(60) not null
);

create table if not exists "entries" (
  "id" serial primary key,
  "userId" integer references users,
  "created" timestamp with time zone not null default current_timestamp,
  "updated" timestamp with time zone not null default current_timestamp,
  "body" text not null
);
