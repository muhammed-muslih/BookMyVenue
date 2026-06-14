import connectDB from "@/config/database";
import { User } from "@/models/user.model";
import { env } from "@/config/env";
import { logger } from "@/config/logger";

const bootstrapAdmin = async () => {
  try {
    await connectDB();

    const email = env.ADMIN_EMAIL;

    const adminExists = await User.findOne({ email, deletedAt: null });

    if (adminExists) {
      logger.info("Admin already exists");
      process.exit(0);
    }

    await User.create({
      firstName: "BookMyVenue",
      lastName: "Admin",
      email,
      roles: ["admin"],
      activeRole: "admin",
      isEmailVerified: true,
    });

    logger.info("Admin created successfully");
    process.exit(0);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

bootstrapAdmin();
