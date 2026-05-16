-- CreateEnum
CREATE TYPE "ResumeTone" AS ENUM ('CORPORATE', 'STARTUP', 'CREATIVE', 'EXECUTIVE', 'MINIMALIST');

-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('CLASSIC_HARVARD', 'CONSULTING_ELITE', 'INVESTMENT_BANKING', 'MODERN_EXECUTIVE', 'TECH_PROFESSIONAL');

-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('PDF', 'DOCX', 'TXT');

-- CreateEnum
CREATE TYPE "AIAction" AS ENUM ('GENERATE_RESUME', 'REWRITE_BULLET', 'SCORE_RESUME', 'GENERATE_COVER_LETTER', 'JOB_MATCH', 'CHAT_ASSIST');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'RESUME_IMPORT', 'RESUME_EXPORT', 'RESUME_UPDATE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "supabaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled Resume',
    "templateId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "atsScore" INTEGER,
    "tone" "ResumeTone" NOT NULL DEFAULT 'CORPORATE',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "publicSlug" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeVersion" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "TemplateCategory" NOT NULL,
    "previewUrl" TEXT NOT NULL,
    "styles" JSONB NOT NULL,
    "structure" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverLetter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resumeId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "jobTitle" TEXT,
    "company" TEXT,
    "tone" "ResumeTone" NOT NULL DEFAULT 'CORPORATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoverLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Export" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "format" "ExportFormat" NOT NULL,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Export_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIUsageLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "AIAction" NOT NULL,
    "tokens" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "supabaseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "link" TEXT,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseId_key" ON "User"("supabaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_publicSlug_key" ON "Resume"("publicSlug");

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");

-- CreateIndex
CREATE INDEX "ResumeVersion_resumeId_idx" ON "ResumeVersion"("resumeId");

-- CreateIndex
CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug");

-- CreateIndex
CREATE INDEX "CoverLetter_userId_idx" ON "CoverLetter"("userId");

-- CreateIndex
CREATE INDEX "Export_resumeId_idx" ON "Export"("resumeId");

-- CreateIndex
CREATE INDEX "AIUsageLog_userId_idx" ON "AIUsageLog"("userId");

-- CreateIndex
CREATE INDEX "AIUsageLog_createdAt_idx" ON "AIUsageLog"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_supabaseId_idx" ON "Notification"("supabaseId");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeVersion" ADD CONSTRAINT "ResumeVersion_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Export" ADD CONSTRAINT "Export_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIUsageLog" ADD CONSTRAINT "AIUsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
