CREATE TABLE spending(
  id uuid NOT NULL,
  title text NOT NULL,
  tag_id int,
  cost numeric NOT NULL,
  spent_at date NOT NULL,
  CONSTRAINT fk_tags
    FOREIGN KEY(tag_id)
      REFERENCES tags(id)
);
