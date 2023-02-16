-- CreateTable
CREATE TABLE "Object" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Date" DATETIME,
    "Object" TEXT,
    "Horizons" TEXT,
    "Segment" TEXT,
    "Region" TEXT,
    "FluidType" TEXT,
    "Category" TEXT,
    "Cultural" TEXT
);

-- CreateTable
CREATE TABLE "Well" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT,
    "Allias" TEXT,
    "Object" TEXT,
    "WHEADX" REAL,
    "WHEADY" REAL,
    "WHEADKB" REAL,
    "FirstDateObject" DATETIME,
    "DRILLCOST" DECIMAL
);
