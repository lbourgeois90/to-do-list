CREATE TABLE "toDoList" (
   "id" serial PRIMARY KEY,
   "task" varchar(255) not null,
   "status" varchar(10) not null
);