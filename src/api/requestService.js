import API from './axiosConfig';

const requestService = {
    createRequest: async (requestData) => {
        try {
            const { userName, professionalName } = requestData;
            const response = await API.post('/api/requests', { userName, professionalName });
            return response.data;
        } catch (error) {
            console.error('Error creating request:', error);
            throw error;
        }
    },

    getUserRequests: async (userName) => {
        try {
            if (!userName) return [];
            const response = await API.get(`/api/requests/user/${encodeURIComponent(userName)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user requests:', error);
            throw error;
        }
    },

    getProfessionalRequests: async (professionalName) => {
        try {
            if (!professionalName) return [];
            const response = await API.get(`/api/requests/professional/${encodeURIComponent(professionalName)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching professional requests:', error);
            throw error;
        }
    },

    updateRequestStatus: async (requestId, status) => {
        try {
            const response = await API.put(`/api/requests/${requestId}?status=${encodeURIComponent(status)}`);
            return response.data;
        } catch (error) {
            console.error('Error updating request status:', error);
            throw error;
        }
    },
};

export default requestService;
