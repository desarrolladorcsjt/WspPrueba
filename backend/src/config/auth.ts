export default {
  secret: process.env.JWT_SECRET || "CL1N1C4S4NJUD4ST4D30*2024",
  expiresIn: "60m",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "CL1N1C4S4NJUD4ST4D30*2024",
  refreshExpiresIn: "7d"
};
