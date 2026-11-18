-- Seed-Daten für die lokale Datenbank (Plan 04, T-28). Keine Personendaten.
create table status_check (id int primary key, message text not null);
insert into status_check values (1, 'Hello codeslage');
