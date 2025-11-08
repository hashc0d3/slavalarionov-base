-- CreateTable
CREATE TABLE "watch_model_straps" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "watchModelId" INTEGER NOT NULL,
    "watchStrapId" INTEGER NOT NULL,
    CONSTRAINT "watch_model_straps_watchModelId_fkey" FOREIGN KEY ("watchModelId") REFERENCES "watch_models" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "watch_model_straps_watchStrapId_fkey" FOREIGN KEY ("watchStrapId") REFERENCES "watch_straps" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "watch_model_straps_watchModelId_watchStrapId_key" ON "watch_model_straps"("watchModelId", "watchStrapId");
