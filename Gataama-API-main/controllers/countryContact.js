const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addCountryContact = async (req, res) => {
    const { countryId } = req.params;
    const { location, phone, email, postalCode } = req.body;
    const userId = req.userId; // Get the userId from the middleware

    try {
        // Find the country by its ID and include the admins
        const country = await prisma.country.findUnique({
            where: { id: parseInt(countryId) },
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

        // Check if a contact already exists for the country
        const existingContact = await prisma.countryContact.findFirst({
            where: { countryId: parseInt(countryId) },
        });

        if (existingContact) {
            return res.status(400).json({ message: "A contact for this country already exists. Only one contact is allowed per country." });
        }

        // Create new contact if no contact exists
        const countryContact = await prisma.countryContact.create({
            data: {
                location,
                phone,
                email,
                postalCode,
                countryId: parseInt(countryId),
            },
        });

        res.status(201).json(countryContact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding country contact' });
    }
};

exports.updateCountryContact = async (req, res) => {
    const { countryId } = req.params;
    const { location, phone, email, postalCode } = req.body;
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

        // Find the existing country contact by countryId
        const existingContact = await prisma.countryContact.findFirst({
            where: { countryId: parseInt(countryId) },
        });

        if (!existingContact) {
            return res.status(404).json({ message: "No contact found for this country." });
        }

        // Update the contact
        const updatedContact = await prisma.countryContact.update({
            where: { id: existingContact.id },
            data: {
                location,
                phone,
                email,
                postalCode,
            },
        });

        res.status(200).json(updatedContact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating country contact' });
    }
};

exports.deleteCountryContact = async (req, res) => {
    const { countryId } = req.params;
    const userId = req.userId;

    try {
        // Find the country and include the admins
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

        // Find the existing country contact by countryId
        const existingContact = await prisma.countryContact.findFirst({
            where: { countryId: parseInt(countryId) },
        });

        if (!existingContact) {
            return res.status(404).json({ message: "No contact found for this country." });
        }

        const deletedCountryContact = await prisma.countryContact.delete({
            where: { id: existingContact.id },
        });

        res.status(200).json({ message: "Country contact deleted successfully", deletedCountryContact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting country contact' });
    }
};

exports.getCountryContact = async (req, res) => {
    const { countryId } = req.params;

    try {
        const countryContact = await prisma.countryContact.findFirst({
            where: { countryId: parseInt(countryId) },
        });

        if (!countryContact) {
            return res.status(404).json({ message: "No contact found for this country." });
        }

        res.status(200).json(countryContact);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching country contact' });
    }
};
