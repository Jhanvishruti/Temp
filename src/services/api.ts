import axios from 'axios';
import { Contributor, Owner } from '../types';

const API_BASE_URL = 'http://localhost:5247/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUserProfile = async (userRole: string, userId: string) => {
  try {
    const response = await api.get(`/${userRole.toLowerCase()}/${userId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (
  userRole: string,
  profileData: Contributor | Owner
) => {
  try {
    const response = await api.put(`/${userRole}`, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};