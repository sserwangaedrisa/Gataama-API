const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new country (Admin Only)
exports.createCountry = async (req, res) => {
  const { name, adminId, description } = req.body;
  
  const image = req.file ? `/uploads/blog/${req.file.filename}` : null;

  try {
    // Check if the provided adminId is for a user with the "countryAdmin" role
    if (adminId) {
      const adminUser = await prisma.user.findUnique({
        where: { id: adminId },
        select: { role: true },
      });

      if (!adminUser || (adminUser.role !== "countryAdmin" && adminUser.role !== "admin")) {
        return res
          .status(400)
          .json({ error: "The provided user is not a country admin" });
      }
    }

    // Create the country and assign the admin if provided
    const country = await prisma.country.create({
      data: {
        name,
        image,
        description,
        admins: adminId ? { connect: { id: adminId } } : undefined,
      },
    });

    res.status(201).json(country);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all countries (Public)
// Get all countries (Public)
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await prisma.country.findMany({
      include: {
        // departments: true,
        admins: true, 
      },
    });


    const transformedCountries = countries.map(country => ({
      id: country.id,
      name: country.name,
      image: country.image,
      description: country.description,
      departments: country.departments,
      admins: country.admins.map(admin => admin.id), 
    }));
    // const response = {
    //   status: "success",
    //   message: "Countries featched successfully",
    //   data: transformedCountries,
    // };

    res.json(transformedCountries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single country by ID (Public)
exports.getCountryById = async (req, res) => {
  const { id } = req.params;
  try {
    const country = await prisma.country.findUnique({
      where: { id: parseInt(id) },
      include: {
        // departments: true,
        admins: true, // Include admins in the response
      },
    });

    if (!country) return res.status(404).json({ error: "Country not found" });

    // Transform the data to include only admin IDs
    const transformedCountry = {
      id: country.id,
      name: country.name,
      image: country.image,
      description: country.description,
      departments: country.departments,
      admins: country.admins.map(admin => admin.id),
    };

    res.json(transformedCountry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCountry = async (req, res) => {
  const { countryId } = req.params;
  const { name, currentAdminId, newAdminId, addAdminId, description } = req.body;
  const image = req.file ? `/uploads/blog/${req.file.filename}` : null;
  console.log(image);
  


  try {
    // Fetch the current country details, including admins
    const country = await prisma.country.findUnique({
      where: { id: parseInt(countryId) },
      include: { admins: true },
    });

    if (!country) {
      return res.status(404).json({ error: "Country not found" });
    }

    let updatedData = {};

    // Update the country name if provided
    if (name) {
      updatedData.name = name;
    }
    if (description) {
      updatedData.description = description;
    }
    if (image) {
      updatedData.image = image;
    }

    // Add a new admin to the country if `addAdminId` is provided
    if (addAdminId) {
      const newAdmin = await prisma.user.findUnique({
        where: { id: addAdminId },
        select: { role: true },
      });


      if (!newAdmin || newAdmin.role !== "countryAdmin" && newAdmin.role !== "admin") {
        return res.status(400).json({ error: "The provided user is not a country admin" });
      }

      updatedData.admins = {
        connect: { id: addAdminId },
      };
    }

    // Replace the current admin with the new admin if both `currentAdminId` and `newAdminId` are provided
    if (currentAdminId && newAdminId) {
      const currentAdminExists = country.admins.some(
        (admin) => admin.id === currentAdminId
      );

      if (!currentAdminExists) {
        return res.status(400).json({ error: "The specified current admin is not currently an admin of this country" });
      }

      const newAdmin = await prisma.user.findUnique({
        where: { id: newAdminId },
        select: { role: true },
      });

      if (!newAdmin || newAdmin.role !== "countryAdmin" && newAdmin.role !== "admin") {
        return res.status(400).json({ error: "The provided new user is not a country admin" });
      }

      updatedData.admins = {
        disconnect: { id: currentAdminId }, // Remove the current admin
        connect: { id: newAdminId },        // Add the new admin
      };
    }

    // Update the country with the accumulated updates
    const updatedCountry = await prisma.country.update({
      where: { id: parseInt(countryId) },
      data: updatedData,
      include: {
        admins: true, // Include the updated admins in the response
      },
    });

    const transformedCountry = {
      id: updatedCountry.id,
      image : updatedCountry.image,
      description : updatedCountry.description,
      name: updatedCountry.name,
      departments: updatedCountry.departments,
      admins: updatedCountry.admins.map(admin => admin.id),
    };

    res.json(transformedCountry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.removeCountryAdmin = async (req, res) => {
  const { id } = req.params;
  const { removeAdminId } = req.body; // Expecting a single admin ID to remove

  try {
    // Fetch the current country details
    const country = await prisma.country.findUnique({
      where: { id: parseInt(id) },
      include: { admins: true }, // Include current admins
    });

    if (!country) {
      return res.status(404).json({ error: "Country not found" });
    }

    // Check if the admin to be removed exists in the current admins
    const currentAdminExists = country.admins.some(
      (admin) => admin.id === removeAdminId
    );

    if (!currentAdminExists) {
      return res.status(400).json({ error: "The specified admin is not currently an admin of this country" });
    }

    // Remove the admin from the list
    const updatedCountry = await prisma.country.update({
      where: { id: parseInt(id) },
      data: {
        admins: {
          disconnect: { id: removeAdminId }, // Remove the specified admin
        },
      },
      include: {
        admins: true, // Include the updated admins in the response
      },
    });
    const transformedCountry = {
      id: updatedCountry.id,
      name: updatedCountry.name,
      departments: updatedCountry.departments,
      admins: updatedCountry.admins.map(admin => admin.id),
    };

    res.json(transformedCountry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a country (Admin Only)
// exports.updateCountry = async (req, res) => {
//   const { id } = req.params;
//   const { name, adminId } = req.body;
//   if (adminId) {
//     const adminUser = await prisma.user.findUnique({
//       where: { id: adminId },
//       select: { role: true },
//     });

//     if (!adminUser || adminUser.role !== "countryAdmin") {
//       return res
//         .status(400)
//         .json({ error: "The provided user is not a country admin" });
//     }
//   }
//   try {
//     const country = await prisma.country.update({
//       where: { id: parseInt(id) },
//       data: {
//         name,
//         admins: adminId ? { connect: { id: adminId } } : undefined,
//       },
//     });
//     res.json(country);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Delete a country (Admin Only)
exports.deleteCountry = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.country.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Country deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
