import prisma from "./prisma_client";

export const USER = prisma.user;
export const ORG = prisma.organisation;
export const ORG_USER = prisma.organisationOnUser;
