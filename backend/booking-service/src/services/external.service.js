const axios = require('axios');
const config = require('../config/config');
const { logger } = require('../config/database');

class ExternalService {
  constructor() {
    this.userService = axios.create({
      baseURL: config.userServiceUrl,
      timeout: 5000
    });

    this.vehicleService = axios.create({
      baseURL: config.vehicleServiceUrl,
      timeout: 5000
    });
  }

  async verifyUser(userId, token) {
    try {
      const response = await this.userService.get(`/api/users/${userId}`, {
        headers: { 'Authorization': token }
      });
      return response.data;
    } catch (error) {
      logger.error(`[ExternalService] Error verifying user: ${error.message}`);
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data.message || 'Error verifying user'
        };
      }
      throw {
        status: 500,
        message: 'Service unavailable'
      };
    }
  }

  async verifyVehicle(vehicleId, token) {
    try {
      const response = await this.vehicleService.get(`/api/vehicles/${vehicleId}`, {
        headers: { 'Authorization': token }
      });
      return response.data;
    } catch (error) {
      logger.error(`[ExternalService] Error verifying vehicle: ${error.message}`);
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data.message || 'Error verifying vehicle'
        };
      }
      throw {
        status: 500,
        message: 'Service unavailable'
      };
    }
  }

  async getUserDetails(userId, token) {
    try {
      const response = await this.userService.get(`/api/users/${userId}`, {
        headers: { 'Authorization': token }
      });
      return response.data;
    } catch (error) {
      logger.error(`[ExternalService] Error getting user details: ${error.message}`);
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data.message || 'Error getting user details'
        };
      }
      throw {
        status: 500,
        message: 'Service unavailable'
      };
    }
  }

  async getVehicleDetails(vehicleId, token) {
    try {
      const response = await this.vehicleService.get(`/api/vehicles/${vehicleId}`, {
        headers: { 'Authorization': token }
      });
      return response.data;
    } catch (error) {
      logger.error(`[ExternalService] Error getting vehicle details: ${error.message}`);
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data.message || 'Error getting vehicle details'
        };
      }
      throw {
        status: 500,
        message: 'Service unavailable'
      };
    }
  }
}

module.exports = new ExternalService(); 