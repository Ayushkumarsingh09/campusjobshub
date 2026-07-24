import type { PrismaClient } from '@prisma/client';

/** Remove duplicate listings created when seed runs against an existing slug registry. */
export async function cleanupStaleListings(prisma: PrismaClient): Promise<void> {
  const isDuplicateListingSlug = (slug: string) => /-2026-\d+$/.test(slug);

  const staleJobs = await prisma.job.findMany({
    where: { deletedAt: null },
    select: { id: true, slug: true },
  });
  const staleJobIds = staleJobs.filter((j) => isDuplicateListingSlug(j.slug)).map((j) => j.id);

  const staleInternships = await prisma.internship.findMany({
    where: { deletedAt: null },
    select: { id: true, slug: true },
  });
  const staleInternIds = staleInternships
    .filter((i) => isDuplicateListingSlug(i.slug))
    .map((i) => i.id);

  if (staleJobIds.length) {
    await prisma.savedJob.deleteMany({ where: { jobId: { in: staleJobIds } } });
    await prisma.application.deleteMany({ where: { jobId: { in: staleJobIds } } });
    await prisma.job.deleteMany({ where: { id: { in: staleJobIds } } });
  }

  if (staleInternIds.length) {
    await prisma.savedJob.deleteMany({ where: { internshipId: { in: staleInternIds } } });
    await prisma.application.deleteMany({ where: { internshipId: { in: staleInternIds } } });
    await prisma.internship.deleteMany({ where: { id: { in: staleInternIds } } });
  }
}
