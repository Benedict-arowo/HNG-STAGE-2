-- DropForeignKey
ALTER TABLE "OrganisationOnUser" DROP CONSTRAINT "OrganisationOnUser_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganisationOnUser" DROP CONSTRAINT "OrganisationOnUser_userId_fkey";

-- AddForeignKey
ALTER TABLE "OrganisationOnUser" ADD CONSTRAINT "OrganisationOnUser_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("orgId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganisationOnUser" ADD CONSTRAINT "OrganisationOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
