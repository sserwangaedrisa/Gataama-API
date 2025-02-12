const nodemailer = require("nodemailer");
const db = require("../middleware/db");

exports.contactForm = async (req, res) => {
  try {
    const dt = {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    };

    const contact = await prisma.contact.create({
      data: dt,
    });

    res.status(201).send({
      message:
        "Your message has been sent successfully. Kindly await a response via email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: process.env.ERROR_MESSAGE,
    });
  }
};

exports.petitionForm = async (req, res) => {
  try {
    const dt = {
      country: req.body.country,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      names: req.body.names,
    };

    const petition = await prisma.petition.create({
      data: dt,
    });

    res.status(201).send({
      message: "You have joined our petition successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: process.env.ERROR_MESSAGE,
    });
  }
};
exports.careerForm = async (req, res) => {
  try {
    let image;
    if (req.file) {
      image = `${process.env.API_URL}/cvs/${req.file.filename}`;
    }

    const dt = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      country: req.body.country,
      cv: image,
      message: req.body.message,
      role: req.body.role,
    };

    const career = await prisma.career.create({
      data: dt,
    });

    res.status(201).send({
      message:
        "Your info has been received. Kindly await our response via email or phone.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: process.env.ERROR_MESSAGE,
    });
  }
};

exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await prisma.career.findMany({
      where: {
        role: "volunteer",
      },
      orderBy: {
        id: "desc",
      },
      take: 20,
    });

    res.status(200).send({
      volunteers: volunteers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: process.env.ERROR_MESSAGE,
    });
  }
};

exports.getPetitions = async (req, res) => {
  try {
    const petitions = await prisma.petition.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).send({
      petitions: petitions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: process.env.ERROR_MESSAGE,
    });
  }
};

// Function to get job seekers (excluding volunteers)
exports.getJobs = async (req, res) => {
  try {
    const jobSeekers = await prisma.career.findMany({
      where: {
        role: {
          not: "volunteer",
        },
      },
      orderBy: {
        id: "desc",
      },
      take: 20,
    });

    res.status(200).send({
      jobSeekers: jobSeekers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: process.env.ERROR_MESSAGE,
    });
  }
};

// Function to get recent contact messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await prisma.contact.findMany({
      orderBy: {
        id: "desc",
      },
      take: 20,
    });

    res.status(200).send({
      messages: messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: process.env.ERROR_MESSAGE,
    });
  }
};

// Function to edit careers form entry
exports.editCareersForm = async (req, res) => {
  try {
    const updates = req.body;

    const updatedCareer = await prisma.career.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: updates,
    });

    res.status(200).send({
      message: "Updated info successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: process.env.ERROR_MESSAGE,
    });
  }
};

// Disconnect Prisma client when done
