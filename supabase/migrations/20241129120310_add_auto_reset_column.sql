alter table "honey_portion_porker"."room" drop constraint "room_ownerRoomId_key";

drop index if exists "honey_portion_porker"."room_ownerRoomId_key";

alter table "honey_portion_porker"."room" add column "autoReset" boolean not null default false;

CREATE UNIQUE INDEX "room_onwerRoomId_key" ON honey_portion_porker.room USING btree ("ownerRoomId");

alter table "honey_portion_porker"."room" add constraint "room_onwerRoomId_key" UNIQUE using index "room_onwerRoomId_key";



