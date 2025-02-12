const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addReaction = async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const { type } = req.body;
  const authorId = req.userId; // Extracted from the request

  const MAX_REACTIONS = 4; // Set the maximum number of reactions

  try {
      // Check how many reactions the user has made for this post
      const userReactionsCount = await prisma.reaction.count({
          where: {
              postId: postId,
              authorId: authorId
          }
      });

      // If the user has already reacted MAX_REACTIONS times, respond with a 403 status
      if (userReactionsCount >= MAX_REACTIONS) {
          return res.status(403).json({ message: 'Reaction limit reached' });
      }

      // Proceed to add the new reaction
      const reaction = await prisma.reaction.create({
          data: {
              type,
              postId,
              authorId
          }
      });

      res.json(reaction);
  } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: error.message });
  }
};

  // Remove a reaction from a post
  exports.removeReaction = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const { authorId, type } = req.body;
  
    try {
      await prisma.reaction.deleteMany({
        where: {
          postId,
          authorId,
          type,
        }
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove reaction' });
    }
  };
  
  // Get all reactions for a post
  exports.getReactions = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
  
    try {
      const reactions = await prisma.reaction.findMany({
        where: { postId }
      });
      res.json(reactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve reactions' });
    }
  };