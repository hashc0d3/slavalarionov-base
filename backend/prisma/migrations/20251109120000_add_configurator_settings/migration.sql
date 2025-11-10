-- AlterTable
ALTER TABLE "watch_straps" ADD COLUMN "buckle_butterfly_price" REAL NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "configurator_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "configurator_additional_options" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "option_name" TEXT NOT NULL,
    "option_title" TEXT NOT NULL,
    "option_price" INTEGER NOT NULL,
    "option_image" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "configuratorSettingsId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "configurator_additional_options_configuratorSettingsId_fkey" FOREIGN KEY ("configuratorSettingsId") REFERENCES "configurator_settings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "configurator_additional_options_configuratorSettingsId_option_name_key" ON "configurator_additional_options"("configuratorSettingsId", "option_name");

