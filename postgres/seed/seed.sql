BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('a', 'a@a.com', 5, '2022-01-01');
INSERT into login (hash, email) values ('$2a$10$pBkbBcx7QjyzUm.0WEjkIu0PNfiWoEJUlCMBjEKJkCzSG/WDPTkom', 'jessie@gmail.com');

COMMIT;