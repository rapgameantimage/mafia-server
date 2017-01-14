create table games (
  id varchar(36) primary key,
  complete boolean default false,
  winner smallint
);
create table game_roles (
  id serial primary key,
  game_id varchar(36) not null,
  steam_id varchar(64) not null,
  rolename varchar(255) not null,
  constraint unique_game_player unique (game_id, steam_id)
);
create index rolename on game_roles (rolename);
create index steam_id on game_roles (steam_id);