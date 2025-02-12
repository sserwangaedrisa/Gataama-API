const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const isAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    if (user.role === "admin") {
      next();
    } else {
      return res.status(403).send({ message: "Require Admin Role!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const isCountryAdmin = async (req, res, next) => {
  const { countryId } = req.params;

  try {
    // Fetch the user based on the userId in the request
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // If the user is a global admin, allow them to proceed
    if (user.role === "admin") {
      return next();
    }

    // Ensure countryId is a valid number
    const parsedCountryId = parseInt(countryId, 10);
    if (isNaN(parsedCountryId)) {
      return res.status(400).json({ error: "Invalid country ID" });
    }

    // Fetch the country and its admins
    const country = await prisma.country.findUnique({
      where: { id: parsedCountryId },
      include: { admins: true },
    });

    if (!country) {
      return res.status(404).json({ error: "Country not found" });
    }

    // Check if the user is a country admin for the specified country
    if (Array.isArray(country.admins) && req.userId) {
      const isCountryAdmin = country.admins.some((admin) => admin.id === req.userId);

      if (!isCountryAdmin) {
        return res.status(403).json({ error: "Access denied. Not a country admin." });
      }

      // User is a country admin, allow them to proceed
      next();
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.error("Error in isAdminOrCountryAdmin middleware:", error);
    res.status(500).json({ error: error.message });
  }
};



module.exports = { isAdmin, isCountryAdmin };
