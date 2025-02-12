const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// Get all departments within a country
exports.getDepartmentsByCountry = async (req, res) => {
  const { countryId } = req.params;
  try {
    const departments = await prisma.department.findMany({
      where: { countryId: parseInt(countryId) },
    });

    console.log('Retrieved departments:', departments);


    // Transform the array to an object with department IDs as keys
    const departmentsObject = departments.reduce((acc, department) => {
      acc[department.id] = {
        id: department.id,
        name: department.name,
        title: department.title,
        content: department.content,
        countryId: department.countryId,
        imageUrl: department.imageUrl,
        published : department.published,
      };
      return acc;
    }, {});

    res.json(departmentsObject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPublishedDepartmentsByCountry = async (req, res) => {
  const { countryId } = req.params;
  try {
    const departments = await prisma.department.findMany({
      where: { countryId: parseInt(countryId),  published: true },
    });

    console.log('Retrieved departments:', departments);

    // Transform the array to an object with department IDs as keys
    const departmentsObject = departments.reduce((acc, department) => {
      acc[department.id] = {
        id: department.id,
        name: department.name,
        title: department.title,
        content: department.content,
        countryId: department.countryId,
        imageUrl: department.imageUrl,
        published : department.published,

      };
      return acc;
    }, {});

    res.json(departmentsObject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getDepartmentById = async (req, res) => {
  const { countryId, id } = req.params;
  try {
    const department = await prisma.department.findFirst({
      where: {
        id: parseInt(id),
        countryId: parseInt(countryId)
      },
     
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Create a new department (Country Admin only)
exports.createDepartment = async (req, res) => {
  const { countryId } = req.params;
  const { name, title, content } = req.body;
  const imageUrl = req.file ? `/uploads/blog/${req.file.filename}` : null;

  try {
    const department = await prisma.department.create({
      data: {
        name,
        title,
        content,
        countryId: parseInt(countryId),
        imageUrl: imageUrl,
      },
    });
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a department (Country Admin only)
exports.updateDepartment = async (req, res) => {
  const { countryId, departmentId } = req.params;
  const { name, title, content } = req.body;
  const imageUrl = req.file ? `/uploads/blog/${req.file.filename}` : null;

  try {
    const department = await prisma.department.updateMany({
      where: {
        id: parseInt(departmentId),
        countryId: parseInt(countryId), // Ensure the department belongs to the specified country
      },
      data: {
        name,
        title,
        content,
        imageUrl: imageUrl,
      },
    });

    if (department.count === 0) {
      return res
        .status(404)
        .json({
          error:
            "Department not found or doesn't belong to the specified country",
        });
    }

    res.json({ message: "Department updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.publishDepartment = async (req, res) => {
  const { countryId, departmentId } = req.params;
  const { published } = req.body;

  try {
    const department = await prisma.department.updateMany({
      where: {
        id: parseInt(departmentId),
        countryId: parseInt(countryId), // Ensure the department belongs to the specified country
      },
      data: {
         published,
      },
    });

    if (department.count === 0) {
      return res
        .status(404)
        .json({
          error:
            "Department not found or doesn't belong to the specified country",
        });
    }

    res.json({ message: "Department published successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Delete a department (Country Admin only)
exports.deleteDepartment = async (req, res) => {
  const { countryId, departmentId } = req.params;

  try {
    const deleted = await prisma.department.deleteMany({
      where: {
        id: parseInt(departmentId),
        countryId: parseInt(countryId), // Ensure the department belongs to the specified country
      },
    });

    if (deleted.count === 0) {
      return res
        .status(404)
        .json({
          error:
            "Department not found or doesn't belong to the specified country",
        });
    }

    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
