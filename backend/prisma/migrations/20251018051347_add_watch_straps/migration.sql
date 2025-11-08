-- CreateTable
CREATE TABLE "watch_straps" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "strap_name" TEXT NOT NULL,
    "strap_title" TEXT NOT NULL,
    "strap_description" TEXT,
    "strap_short_description" TEXT,
    "price" REAL NOT NULL,
    "preview_image" TEXT,
    "ultra_preview_image" TEXT,
    "has_buckle_butterfly" BOOLEAN NOT NULL DEFAULT false,
    "strap_params" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "watch_straps_strap_name_key" ON "watch_straps"("strap_name");
