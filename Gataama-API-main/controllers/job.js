const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createJob = async (req, res) => {
  const { title,  subTitle, description, location, deadline, status } = req.body;


  const userId = req.userId;

  try {

    const country = await prisma.country.findUnique({
      where: { id: parseInt(location) },
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

    const job = await prisma.job.create({
      data: { 
        title, 
        subTitle, 
        description, 
       location,
       deadline,
        status,
      },
    });
    res.status(201).json({ message: 'job created successfully', job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job ', e : error.message });
  }
};





exports.createJobForMain = async (req, res) => {
  const { title,  subTitle, description, deadline, status } = req.body;


  try {
    const job = await prisma.job.create({
      data: { 
        title, 
        subTitle, 
        isMain : true,
        description, 
       
       deadline,
        status,
      },
    });
    res.status(201).json({ message: 'job created successfully', job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job ', e : error.message });
  }
};

// controllers/job.js

exports.getJobs = async (req, res) => {
  try {
    // Extract countryId from query parameters
    const { countryId } = req.query;

    // Create query object for filtering
    const query = {};

    // Add location filter if countryId is provided
    if (countryId) {
      query.location = parseInt(countryId, 10);
    }

    // Fetch jobs from the database with optional filtering
    const jobs = await prisma.job.findMany({
      where: query
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to retrieve jobs' });
  }
};


exports.getPublishedJobs = async (req, res) => {
  try {
    // Extract countryId from query parameters
    const { countryId } = req.query;

    // Create query object for filtering
    const query = {
      status: true, // Filter for jobs where status is true
    };

    // Add location filter if countryId is provided
    if (countryId) {
      query.location = parseInt(countryId, 10);
    }

    // Fetch jobs from the database with optional filtering
    const jobs = await prisma.job.findMany({
      where: query,
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to retrieve jobs' });
  }
};


exports.getJobsMain = async (req, res) => {
  try {
    // Create query object to filter for isMain = true
    const query = {
      isMain: true
    };

    // Fetch jobs from the database with the specified filter
    const jobs = await prisma.job.findMany({
      where: query
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to retrieve jobs' });
  }
};
// Other controller methods...




exports.getJobById = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve job' });
  }
};

exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, subTitle, description, deadline, status } = req.body;

  const userId = req.userId;

  try {
      // Fetch the job by its ID
      const job = await prisma.job.findUnique({
          where: { id: parseInt(id, 10) },
      });

      if (!job) {
          return res.status(404).json({ message: "Job not found" });
      }

      // Get the location ID from the job
      const locationId = job.location;

      // Find the country to check if the user is an admin
      const country = await prisma.country.findUnique({
          where: { id: locationId },
          include: { admins: true },
      });

      if (!country) {
          return res.status(404).json({ message: "Country not found" });
      }

      // Check if the user making the request is one of the country admins
      const isAdmin = country.admins.some(admin => admin.id === userId);

      if (!isAdmin) {
          return res.status(403).json({ message: "Access denied. You are not an admin for this country." });
      }

      // Now update the job with the new data
      const updatedJob = await prisma.job.update({
          where: { id: parseInt(id, 10) },
          data: { 
              title, 
              subTitle, 
              description,
              deadline,
              status,
          },
      });

      res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update job', error: error.message });
  }
};



exports.updateMainJob = async (req, res) => {
  const { id } = req.params;
  const { title,  subTitle, description, deadline, status } = req.body;


  try {
    const job = await prisma.job.update({
      where: { id: parseInt(id) },
      data: { 
        title, 
        subTitle, 
        description,
        isMain : true,
        deadline,
        status
      },
    });
    res.status(200).json({ message: 'job updated successfully', job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
};

exports.deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    
    await prisma.job.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
};


