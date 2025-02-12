const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getPostByDepartment = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const post = await prisma.departmentPost.findUnique({
      where: { departmentId: parseInt(departmentId) },
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new post (Country Admin only)
exports.createPost = async (req, res) => {
  const { departmentId } = req.params;
  const { title, content } = req.body;
  try {
    const post = await prisma.departmentPost.create({
      data: {
        title,
        content,
        department: { connect: { id: parseInt(departmentId) } },
      },
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a post (Country Admin only)
exports.updatePost = async (req, res) => {
  const { departmentId } = req.params;
  const { title, content } = req.body;
  try {
    const post = await prisma.departmentPost.update({
      where: { departmentId: parseInt(departmentId) },
      data: {
        title,
        content,
      },
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a post (Country Admin only)
exports.deletePost = async (req, res) => {
  const { departmentId } = req.params;
  try {
    await prisma.departmentPost.delete({
      where: { departmentId: parseInt(departmentId) },
    });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
