import axios from 'axios';

export const getM2MAccessToken = async (): Promise<string> => {
    const url = `https://${process.env.AUTH0_DOMAIN}/oauth/token`;

    const axiosInstance = axios.create({
        headers: {
            'Content-Type': 'application/json',
        },
        validateStatus: null,
    });

    try {
        const response = await axiosInstance.post(
            url,
            {
                client_id: process.env.M2M_CLIENT_ID,
                client_secret: process.env.M2M_CLIENT_SECRET,
                audience: process.env.M2M_AUDIENCE,
                grant_type: 'client_credentials',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.data.access_token;
    } catch (error) {
        throw error; // temporary error handling
    }
};
