-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('UNREAD', 'READ', 'REPLIED');

-- AlterEnum
ALTER TYPE "ReservationStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "contact_messages" ADD COLUMN     "status" "ContactStatus" NOT NULL DEFAULT 'UNREAD';
