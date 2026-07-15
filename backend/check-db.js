import prisma from "./src/config/prisma.js";

async function run() {
  try {
    const [users, customerProfiles, agentProfiles, zones, areas, rates, orders] = await Promise.all([
      prisma.user.count(),
      prisma.customerProfile.count(),
      prisma.agentProfile.count(),
      prisma.zone.count(),
      prisma.area.count(),
      prisma.rateCard.count(),
      prisma.order.count(),
    ]);

    console.log("=== DB RECORD COUNTS ===");
    console.log(`Users (Total): ${users}`);
    console.log(`Customer Profiles: ${customerProfiles}`);
    console.log(`Agent Profiles: ${agentProfiles}`);
    console.log(`Zones: ${zones}`);
    console.log(`Areas: ${areas}`);
    console.log(`Rate Cards: ${rates}`);
    console.log(`Orders: ${orders}`);
    console.log("========================");
  } catch (err) {
    console.error("DB check failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
