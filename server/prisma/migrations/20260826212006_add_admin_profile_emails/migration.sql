-- CreateTable
CREATE TABLE "admin_profile_emails" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "admin_profile_emails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_profile_emails_adminId_idx" ON "admin_profile_emails"("adminId");

-- AddForeignKey
ALTER TABLE "admin_profile_emails" ADD CONSTRAINT "admin_profile_emails_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
