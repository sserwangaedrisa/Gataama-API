-- CreateTable
CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "meetingId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_meetingId_key" ON "Meeting"("meetingId");
