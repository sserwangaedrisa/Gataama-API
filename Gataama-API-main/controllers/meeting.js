const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createMeeting = async (req, res) => {
  const { title,  startTime, endTime } = req.body;
  const image = req.file ? `/uploads/blog/${req.file.filename}` : null;

  const meetingId = generateMeetingId();

  try {
    const meeting = await prisma.meeting.create({
      data: { 
        meetingId, 
        title, 
        image, 
        startTime: new Date(startTime), 
        endTime: new Date(endTime) 
      },
    });
    res.status(201).json({ message: 'Meeting created successfully', meeting });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meeting ', e : error.message });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await prisma.meeting.findMany();
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve meetings' });
  }
};

exports.getMeetingById = async (req, res) => {
  const { id } = req.params;

  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: parseInt(id) },
    });
    if (meeting) {
      res.status(200).json(meeting);
    } else {
      res.status(404).json({ message: 'Meeting not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve meeting' });
  }
};

exports.updateMeeting = async (req, res) => {
  const { id } = req.params;
  const { title,  startTime, endTime } = req.body;
  const image = req.file ? `/uploads/blog/${req.file.filename}` : null;


  try {
    const meeting = await prisma.meeting.update({
      where: { id: parseInt(id) },
      data: { 
        title, 
        image, 
        startTime: new Date(startTime), 
        endTime: new Date(endTime) 
      },
    });
    res.status(200).json({ message: 'Meeting updated successfully', meeting });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meeting' });
  }
};

exports.deleteMeeting = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.meeting.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete meeting' });
  }
};


const generateMeetingId = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let meetingId = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      meetingId += characters[randomIndex];
    }
    return meetingId;
  };
  