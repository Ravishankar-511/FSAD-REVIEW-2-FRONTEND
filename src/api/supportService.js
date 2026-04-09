import API from './axiosConfig';

const supportService = {
    getSupportTickets: async () => {
        try {
            const response = await API.get('/api/support');
            return response.data;
        } catch (error) {
            console.error('Error fetching support tickets:', error);
            throw error;
        }
    },

    createSupportTicket: async (ticketData) => {
        try {
            const { userName, subject, category, priority, description } = ticketData;
            const response = await API.post('/api/support', {
                userName,
                subject,
                category,
                priority,
                description,
            });
            return response.data;
        } catch (error) {
            console.error('Error creating support ticket:', error);
            throw error;
        }
    },
};

export default supportService;
