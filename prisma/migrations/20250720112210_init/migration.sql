-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Election" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Election_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "electionId" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Election" ADD CONSTRAINT "Election_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
