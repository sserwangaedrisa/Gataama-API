const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createComment = async (req, res) => {
  try {
    const { content, postId, authorId, parentId } = req.body;

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
        parentId, // This can be null for top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            fullNames: true,
            email: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                fullNames: true,
                email: true,
              },
            },
          },
        },
      },
    });

    
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getCommentsByPostId = async (req, res) => {
  console.log("getCommentsByPostId");
  
  try {
    const { postId } = req.params;
    console.log("Post ID:", postId); // Log the postId

    // Convert postId to an integer
    const postIdInt = parseInt(postId, 10);
    if (isNaN(postIdInt)) {
      return res.status(400).json({ message: "Invalid post ID." });
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: postIdInt, // Use the integer value here
        parentId: null, // Top-level comments only
      },
      
      include: {
        author: {
          select: {
            id: true,
            fullNames: true,
            email: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                fullNames: true,
                email: true,
              },
            },
          },
      }},
    });

    
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        author: {
          select: {
            id: true,
            fullNames: true,
            email: true,
          },
        },
        post: true,
      },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        author: {
          select: {
            id: true,
            fullNames: true,
            email: true,
          },
        },
        post: true,
      },
    });
    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Fetch user ID from JWT token
    const userId = req.userId;

    // Check if the user is authorized to update the comment
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id, 10) },
      select: { userId: true },
    });

    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res
        .status(403)
        .send({ message: "You are not authorized to update this comment" });
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id, 10) },
      data: { content },
    });

    res.json(updatedComment);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch user ID from JWT token
    const userId = req.userId;

    // Check if the user is authorized to delete the comment
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id, 10) },
      select: { userId: true },
    });

    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res
        .status(403)
        .send({ message: "You are not authorized to delete this comment" });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: parseInt(id, 10) },
    });

    res.send({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
