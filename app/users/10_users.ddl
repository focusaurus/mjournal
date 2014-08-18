DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS session;

-- Table: users
CREATE TABLE users
(
  id serial NOT NULL,
  email character varying(256) NOT NULL,
  "bcryptedPassword" character(60) NOT NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email)
)
WITH (
  OIDS=FALSE
);

-- Table: entries
CREATE TABLE entries
(
  id serial NOT NULL,
  "userId" integer,
  created timestamp with time zone NOT NULL DEFAULT now(),
  updated timestamp with time zone NOT NULL DEFAULT now(),
  body text NOT NULL,
  tags character varying(256),
  "textSearch" tsvector,
  CONSTRAINT entries_pkey PRIMARY KEY (id),
  CONSTRAINT "entries_userId_fkey" FOREIGN KEY ("userId")
      REFERENCES users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);

-- Index: "textSearchGin"

DROP INDEX IF EXISTS "textSearchGin";

CREATE INDEX "textSearchGin"
  ON entries
  USING gin
  ("textSearch");


-- Trigger: "textSearchUpdate" on entries

DROP TRIGGER IF EXISTS "textSearchUpdate" ON entries;

CREATE TRIGGER "textSearchUpdate"
  BEFORE INSERT OR UPDATE
  ON entries
  FOR EACH ROW
  EXECUTE PROCEDURE tsvector_update_trigger('textSearch', 'pg_catalog.english', 'body', 'tags');

-- See https://raw.github.com/voxpelli/node-connect-pg-simple/master/table.sql
CREATE TABLE "public"."session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;