-- CreateTable
CREATE TABLE "WorkspaceSettings" (
    "id" TEXT NOT NULL,
    "supabaseId" TEXT NOT NULL,
    "notifications" JSONB NOT NULL,
    "exports" JSONB NOT NULL,
    "editor" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceSettings_supabaseId_key" ON "WorkspaceSettings"("supabaseId");

-- CreateIndex
CREATE INDEX "WorkspaceSettings_supabaseId_idx" ON "WorkspaceSettings"("supabaseId");
