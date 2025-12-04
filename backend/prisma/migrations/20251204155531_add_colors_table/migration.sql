/*
  Warnings:

  - You are about to drop the column `color_code` on the `frame_colors` table. All the data in the column will be lost.
  - You are about to drop the column `color_name` on the `frame_colors` table. All the data in the column will be lost.
  - You are about to alter the column `discountAmount` on the `promo_codes` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `discountPercent` on the `promo_codes` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - Added the required column `colorId` to the `frame_colors` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "colors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "technical_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "hex_code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "strap_base_images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "colorId" INTEGER NOT NULL,
    "view1Image" TEXT,
    "view2Image" TEXT,
    "view3Image" TEXT,
    "watchStrapId" INTEGER NOT NULL,
    CONSTRAINT "strap_base_images_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "strap_base_images_watchStrapId_fkey" FOREIGN KEY ("watchStrapId") REFERENCES "watch_straps" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_configurator_additional_options" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "option_name" TEXT NOT NULL,
    "option_title" TEXT NOT NULL,
    "option_price" INTEGER NOT NULL,
    "option_image" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "configuratorSettingsId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "configurator_additional_options_configuratorSettingsId_fkey" FOREIGN KEY ("configuratorSettingsId") REFERENCES "configurator_settings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_configurator_additional_options" ("configuratorSettingsId", "createdAt", "id", "option_image", "option_name", "option_price", "option_title", "sort_order", "updatedAt") SELECT "configuratorSettingsId", "createdAt", "id", "option_image", "option_name", "option_price", "option_title", "sort_order", "updatedAt" FROM "configurator_additional_options";
DROP TABLE "configurator_additional_options";
ALTER TABLE "new_configurator_additional_options" RENAME TO "configurator_additional_options";
CREATE UNIQUE INDEX "configurator_additional_options_configuratorSettingsId_option_name_key" ON "configurator_additional_options"("configuratorSettingsId", "option_name");
CREATE TABLE "new_configurator_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimated_date" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_configurator_settings" ("createdAt", "description", "estimated_date", "id", "title", "updatedAt") SELECT "createdAt", "description", "estimated_date", "id", "title", "updatedAt" FROM "configurator_settings";
DROP TABLE "configurator_settings";
ALTER TABLE "new_configurator_settings" RENAME TO "configurator_settings";
CREATE TABLE "new_frame_colors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "colorId" INTEGER NOT NULL,
    "view1Image" TEXT,
    "view2Image" TEXT,
    "view3Image" TEXT,
    "watchModelId" INTEGER NOT NULL,
    CONSTRAINT "frame_colors_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "frame_colors_watchModelId_fkey" FOREIGN KEY ("watchModelId") REFERENCES "watch_models" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_frame_colors" ("id", "view1Image", "view2Image", "view3Image", "watchModelId") SELECT "id", "view1Image", "view2Image", "view3Image", "watchModelId" FROM "frame_colors";
DROP TABLE "frame_colors";
ALTER TABLE "new_frame_colors" RENAME TO "frame_colors";
CREATE TABLE "new_promo_codes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "discountPercent" INTEGER,
    "discountAmount" INTEGER,
    "activationsLeft" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_promo_codes" ("activationsLeft", "code", "createdAt", "discountAmount", "discountPercent", "id", "updatedAt") SELECT "activationsLeft", "code", "createdAt", "discountAmount", "discountPercent", "id", "updatedAt" FROM "promo_codes";
DROP TABLE "promo_codes";
ALTER TABLE "new_promo_codes" RENAME TO "promo_codes";
CREATE UNIQUE INDEX "promo_codes_code_key" ON "promo_codes"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "colors_technical_name_key" ON "colors"("technical_name");
