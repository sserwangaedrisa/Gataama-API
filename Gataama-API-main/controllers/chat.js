const Together = require("together-ai");
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY }); 
require('dotenv').config();

const chatMessage = async (io, socket, messageData) => {
    try {
        const gataamaInfo = `
            Gataama is a visionary organization that aims to unite diverse communities of African descent worldwide. Our mission extends beyond geographical boundaries and encompasses not only African states and the people of African descent but also indigenous Black communities in Asia and throughout the world. We believe that by bringing together individuals and communities with a shared heritage, we can build a powerful movement towards unity and progress.

            Our vision is to foster a spirit of cooperation and collaboration among all peoples of African descent, including those in Asia, Australia, and beyond. We recognize that the struggles and aspirations of African diaspora communities are interconnected, regardless of their location. By embracing our common heritage and working together, we can overcome the challenges that our communities face and create a society defined by justice, equality, and prosperity.

            Through Gataama, we aim to create a platform that facilitates dialogue, exchange of ideas, and collaboration among diverse communities. We seek to provide resources, support, and opportunities for individuals and organizations to come together, share experiences, and collectively address issues affecting our communities.

            By fostering a sense of unity, we can harness the collective strength and knowledge of our global community. Together, we can advocate for social and economic empowerment, fight against systemic racism and discrimination, and promote cultural preservation and celebration. We believe that through our shared commitment to a brighter future, we can create meaningful change and shape a world that respects and uplifts all individuals of African descent.

            Furthermore, Gataama recognizes the importance of forging alliances and partnerships with like-minded organizations and individuals who share our vision. By collaborating with diverse stakeholders, we can amplify our impact, exchange best practices, and work towards common goals.

            In conclusion, Gataama is dedicated to unifying all peoples of African descent worldwide, including those in Africa, the Caribbean, Melanesian islands, Black communities in Asia, and beyond. By fostering cooperation and collaboration, we strive to build a powerful movement that promotes justice, equality, and prosperity for all. Together, we can create a society where our shared heritage is celebrated, our voices are heard, and our communities thrive.
        `;

        const prompt = `
            The user is asking about Gataama, an organization that unites communities of African descent worldwide. 
            Here is some information about Gataama:
            ${gataamaInfo}
            User's Message: ${messageData.text}
        `;

        // Send the prompt to the Together AI API
        const response = await together.chat.completions.create({
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: messageData.text }
            ],
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        });

        // Extract the AI's response
        const result = response.choices[0].message.content;

        // Send the response back to the frontend
        socket.emit('chatMessage', { text: result, sender: 'AI' });
        
    } catch (error) {
        console.error('AI Error:', error);

        // Send an error response to the frontend
        io.to(socket.id).emit('chatMessage', { 
            text: "Sorry, I couldn't process your message. Please try again later.", 
            sender: 'AI' 
        });
    }
};

module.exports = chatMessage;