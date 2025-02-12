const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// Add a team member to a country
exports.addTeamMember = async (req, res) => {
    const { countryId } = req.params;
    const { name, position, linkedin, facebook, twitter, youtube, description } = req.body;
    const profilePicture = req.file ? `/uploads/blog/${req.file.filename}` : null;

    const userId = req.userId; // Get the userId from the middleware
  
    try {
      // Find the country by its ID and include the admins
      const country = await prisma.country.findUnique({
        where: { id: parseInt(countryId) },
        include: { admins: true }, // Include the admins
      });
  
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
  
      // Check if the user making the request is one of the country admins
      const isAdmin = country.admins.some(admin => admin.id === userId);
  
      if (!isAdmin) {
        return res.status(403).json({ message: "Access denied. You are not an admin for this country." });
      }
  
      // Create the new team member if the user is a country admin
      const teamMember = await prisma.teamMember.create({
        data: {
          name,
          profilePicture,
          position,
          linkedin,
          facebook,
          twitter,
          youtube,
          description,
          countryId: parseInt(countryId),
        },
      });
  
      res.status(201).json(teamMember);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding team member' });
    }
  };

  exports.getTeamsMain = async (req, res) => {
    try {
      // Create query object to filter for isMain = true
      const query = {
        isMain: true
      };
  
      // Fetch jobs from the database with the specified filter
      const teams = await prisma.teamMember.findMany({
        where: query
      });
  
      res.status(200).json(teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ error: 'Failed to retrieve teams' });
    }
  };

  exports.addTeamMemberForMain = async (req, res) => {
    const { name, position, linkedin, facebook, twitter, youtube, description } = req.body;
    const profilePicture = req.file ? `/uploads/blog/${req.file.filename}` : null;

  
    try {
     
      const teamMember = await prisma.teamMember.create({
        data: {
          name,
          profilePicture,
          position,
          linkedin,
          facebook,
          twitter,
          youtube,
          description,
          isMain : true
        },
      });
  
      res.status(201).json(teamMember);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding team member' });
    }
  };

// Get all team members for a specific country
exports.getTeamMembersByCountry = async (req, res) => {
  const { countryId } = req.params;

  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: { countryId: parseInt(countryId) }
    });

    res.status(200).json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching team members' });
  }
};

// Update a team member
exports.updateTeamMember = async (req, res) => {
    const { teamMemberId, countryId } = req.params;
    const { name, position, linkedin, facebook, twitter, youtube, description } = req.body;
    const profilePicture = req.file ? `/uploads/blog/${req.file.filename}` : null;

    const userId = req.userId;
  
    try {
      // Fetch the country and its admins
      const country = await prisma.country.findUnique({
        where: { id: parseInt(countryId) },
        include: { admins: true },
      });
  
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
  
      // Check if the user is one of the country admins
      const isAdmin = country.admins.some(admin => admin.id === userId);
  
      if (!isAdmin) {
        return res.status(403).json({ message: "Access denied. You are not an admin for this country." });
      }
  
      // Proceed to update the team member
      const updatedTeamMember = await prisma.teamMember.update({
        where: { id: parseInt(teamMemberId) },
        data: {
          name,
            profilePicture,
          position,
          linkedin,
          facebook,
          twitter,
          youtube,
          description,
        },
      });
  
      res.status(200).json(updatedTeamMember);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating team member' });
    }
  };


  exports.updateTeamMemberForMain = async (req, res) => {
    const { teamMemberId } = req.params;
    const { name, position, linkedin, facebook, twitter, youtube, description } = req.body;
    const profilePicture = req.file ? `/uploads/blog/${req.file.filename}` : null;

  
    try {
    
      const updatedTeamMember = await prisma.teamMember.update({
        where: { id: parseInt(teamMemberId) },
        data: {
          name,
          profilePicture,
          position,
          linkedin,
          facebook,
          twitter,
          youtube,
          isMain : true,
          description,
        },
      });
  
      res.status(200).json(updatedTeamMember);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating team member' });
    }
  };

// Delete a team member
exports.deleteTeamMember = async (req, res) => {
    const { teamMemberId, countryId } = req.params;
    const userId = req.userId; // Get the userId from the middleware
  
    try {
      // Find the country and include the admins
      const country = await prisma.country.findUnique({
        where: { id: parseInt(countryId) },
        include: { admins: true }, // Include the admins
      });
  
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
  
      // Check if the user is one of the country admins
      const isAdmin = country.admins.some((admin) => admin.id === userId);
  
      if (!isAdmin) {
        return res.status(403).json({ message: "Access denied. You are not an admin for this country." });
      }
  
      // Proceed to delete the team member if the user is an admin
      const deletedTeamMember = await prisma.teamMember.delete({
        where: { id: parseInt(teamMemberId) },
      });
  
      res.status(200).json({ message: "Team member deleted successfully", deletedTeamMember });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting team member' });
    }
  };
  
  exports.deleteMainTeamMember = async (req, res) => {
    const { teamMemberId } = req.params;
    
    try {

      const deletedTeamMember = await prisma.teamMember.delete({
        where: { id: parseInt(teamMemberId) },
      });
  
      res.status(200).json({ message: "Team member deleted successfully", deletedTeamMember });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting team member' });
    }
  };
  
