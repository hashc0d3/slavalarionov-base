-- CreateTable
CREATE TABLE "watch_models" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model_name" TEXT NOT NULL,
    "watch_model_name" TEXT NOT NULL,
    "watch_model_manufacturer" TEXT,
    "main_image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "watch_sizes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "watch_size" TEXT NOT NULL,
    "watchModelId" INTEGER NOT NULL,
    CONSTRAINT "watch_sizes_watchModelId_fkey" FOREIGN KEY ("watchModelId") REFERENCES "watch_models" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "frame_colors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "color_name" TEXT NOT NULL,
    "color_code" TEXT,
    "watchModelId" INTEGER NOT NULL,
    CONSTRAINT "frame_colors_watchModelId_fkey" FOREIGN KEY ("watchModelId") REFERENCES "watch_models" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "watch_models_watch_model_name_key" ON "watch_models"("watch_model_name");
