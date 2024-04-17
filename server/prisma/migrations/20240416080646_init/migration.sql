-- DropForeignKey
ALTER TABLE "Dependent" DROP CONSTRAINT "Dependent_employeeId_fkey";

-- AddForeignKey
ALTER TABLE "Dependent" ADD CONSTRAINT "Dependent_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
