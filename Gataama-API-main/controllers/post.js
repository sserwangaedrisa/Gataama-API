const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const upload = require("../middleware/image-upload");

exports.createPost = async (req, res) => {
  try {
    const { title, content, published, categoryIds, isFeatured } = req.body;
    const imageUrl = req.file ? `/uploads/blog/${req.file.filename}` : null;
    const authorId = req.userId; // Extract userId from verified token

    const parsedIsFeatured = isFeatured === "true";

    // Fetch the author's role from the database
    const author = await prisma.user.findUnique({
      where: { id: authorId },
      select: { role: true },
    });

    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }

    // Check if the role is 'admin' or 'countryAdmin'
    const isAdmin = author.role === 'admin';
    const isCountryAdmin = author.role === 'countryAdmin';

    // Default to false for 'countryAdmin'
    const parsedPublished = isAdmin ? (published === "true") : false;

    // Ensure categoryIds is an integer
    const parsedCategoryId = parseInt(categoryIds, 10);

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: parsedPublished,
        imageUrl,
        isFeatured: parsedIsFeatured,
        author: { connect: { id: authorId } },
        categories: {
          connect: { id: parsedCategoryId }, // Connect single category ID
        },
      },
      include: {
        author: {
          select: {
            id: true,
            fullNames: true,
            email: true,
          },
        },
        categories: true,
      },
    });

    res.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .send({ message: "Error creating post", error: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

exports.search = async (req, res) => {
  const { title, category } = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        AND: [
          title
            ? {
                title: {
                  contains: title,
                  mode: "insensitive",
                },
              }
            : {},
          category
            ? {
                categories: {
                  some: {
                    name: {
                      equals: category,
                      mode: "insensitive",
                    },
                  },
                },
              }
            : {},
        ],
      },
      include: {
        categories: true,
        author: {
          select: {
            id: true,
            fullNames: true,
            email: true,
          },
        },
        comments: {
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
        },
      },
    });

    res.json(posts);
  } catch (error) {
    console.error("Search and filter error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      // where: {
      //   published: true, // Filter posts where published is true
      // },
      include: {
        author: {
          select: {
            id: true,
            fullNames: true,
            email: true,
          },
        },
        categories: true,
        comments: {
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
        },
      },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

exports.getAllPublishedPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true, // Filter posts where published is true
      },
      include: {
        author: {
          select: {
            id: true,
            fullNames: true,
            email: true,
          },
        },
        categories: true,
        comments: {
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
        },
      },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Increment the views count
    await prisma.post.update({
      where: { id: parseInt(id, 10) },
      data: { views: { increment: 1 } },
    });

    // Fetch the post details with author, categories, comments, and reactions
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        author: {
          select: {
            id: true,
            fullNames: true,
            email: true,
          },
        },
        categories: true,
        comments: {
          where: { parentId: null }, // Fetch only top-level comments
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
        },
        reactions: true, // Include reactions in the response
      },
    });

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    // Remove duplicate comments manually (if necessary)
    const uniqueComments = post.comments.filter((comment, index, self) => {
      return index === self.findIndex((c) => c.id === comment.id);
    });

    // Replace comments with filtered uniqueComments
    post.comments = uniqueComments;

    res.json(post);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getPopularPosts = async (req, res) => {
  try {
    const popularPosts = await prisma.post.findMany({
      orderBy: [
        { views: 'desc' }, // Sort by views first
        { reactions: { _count: 'desc' } }, // Then sort by the number of reactions
      ],
      include: {
        author: {
          select: {
            id: true,
            fullNames: true,
            email: true,
          },
        },
        categories: true,
        reactions: true,
      },
      take: 6, // Return only the top 10 popular posts
    });

    res.json(popularPosts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


exports.publishPost = async (req, res) => {


    const { id } = req.params;
    const { published } = req.body;


    try {
      const post = await prisma.post.update({
        where: {
          id: parseInt(id),
          
        },
        data: {
           published : published,
        },
      });
  
      if (post.count === 0) {
        return res
          .status(404)
          .json({
            error:
              "Blog not found",
          });
      }
  
      res.json({ message: "Blog published successfully" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
};



exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, published, categoryIds, isFeatured } = req.body;
  const imageUrl = req.file ? `/uploads/blog/${req.file.filename}` : null;

  const authorId = req.userId; // Extract userId from verified token

  try {
      const author = await prisma.user.findUnique({
          where: { id: authorId },
          select: { role: true },
      });

      if (!author) {
          return res.status(404).send({ message: "Author not found" });
      }

      const userRole = author.role;

      // Construct the update data object conditionally
      const updateData = {};

      if (title) {
          updateData.title = title;
      }

      if (content !== undefined) {
          updateData.content = content; // Include content only if defined
      }

      if (published !== undefined) {
          updateData.published = published === "true"; // Ensure this is a boolean
      }

      if (imageUrl) {
          updateData.imageUrl = imageUrl;
      }

      if (isFeatured !== undefined) {
          updateData.isFeatured = isFeatured === "true";
      }

      // Only include categories if categoryIds are provided
      if (categoryIds) {
          updateData.categories = {
              connect: Array.isArray(categoryIds)
                  ? categoryIds.map(catId => ({ id: parseInt(catId, 10) }))
                  : [{ id: parseInt(categoryIds, 10) }],
          };
      }

      if (userRole === "admin") {
          const post = await prisma.post.update({
              where: { id: parseInt(id, 10) },
              data: updateData,
          });
          return res.json(post);
      } else if (userRole === "countryAdmin") {
          const post = await prisma.post.findUnique({
              where: { id: parseInt(id, 10) },
          });

          if (!post) {
              return res.status(404).send({ message: "Post not found" });
          }

          if (post.authorId !== authorId) {
              return res.status(403).send({
                  message: "Unauthorized: You can only update your own posts",
              });
          }

          const updatedPost = await prisma.post.update({
              where: { id: parseInt(id, 10) },
              data: updateData,
          });
          return res.json(updatedPost);
      } else {
          return res.status(403).send({ message: "Unauthorized: Insufficient privileges" });
      }
  } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).send({ message: "Error updating post" });
  } finally {
      await prisma.$disconnect();
  }
};


exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({
      where: { id: parseInt(id, 10) },
    });
    res.send({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
