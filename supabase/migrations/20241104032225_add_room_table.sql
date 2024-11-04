create schema if not exists "honey_portion_porker";
create table "honey_portion_porker"."room" (
    "roomId" uuid not null default gen_random_uuid(),
    "onwerRoomId" uuid not null default gen_random_uuid(),
    "memberRoomId" uuid not null default gen_random_uuid(),
    "note" text not null default ''::text,
    "updatedAt" timestamp with time zone default now(),
    "createdAt" timestamp with time zone not null default now()
);
alter table "honey_portion_porker"."room" enable row level security;
CREATE UNIQUE INDEX "room_memberRoomId_key" ON honey_portion_porker.room USING btree ("memberRoomId");
CREATE UNIQUE INDEX "room_onwerRoomId_key" ON honey_portion_porker.room USING btree ("onwerRoomId");
CREATE UNIQUE INDEX room_pkey ON honey_portion_porker.room USING btree ("roomId");
alter table "honey_portion_porker"."room"
add constraint "room_pkey" PRIMARY KEY using index "room_pkey";
alter table "honey_portion_porker"."room"
add constraint "room_memberRoomId_key" UNIQUE using index "room_memberRoomId_key";
alter table "honey_portion_porker"."room"
add constraint "room_onwerRoomId_key" UNIQUE using index "room_onwerRoomId_key";
grant usage on schema "honey_portion_porker" to postgres,
    anon,
    authenticated,
    service_role;
grant all privileges on all tables in schema "honey_portion_porker" to postgres,
    anon,
    authenticated,
    service_role;
grant all privileges on all functions in schema "honey_portion_porker" to postgres,
    anon,
    authenticated,
    service_role;
grant all privileges on all sequences in schema "honey_portion_porker" to postgres,
    anon,
    authenticated,
    service_role;
alter default privileges in schema "honey_portion_porker"
grant all on tables to postgres,
    anon,
    authenticated,
    service_role;
alter default privileges in schema "honey_portion_porker"
grant all on functions to postgres,
    anon,
    authenticated,
    service_role;
alter default privileges in schema "honey_portion_porker"
grant all on sequences to postgres,
    anon,
    authenticated,
    service_role;