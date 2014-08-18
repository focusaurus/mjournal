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
  EXECUTE PROCEDURE tsvector_update_trigger(
    'textSearch', 'pg_catalog.english', 'body', 'tags'
  );
