class responseHandler {
    constructor(data, message = "Success", statusCode = 200) {
      this.success = true;
      this.message = message;
      this.data = data;
      this.statusCode = statusCode;
    }
  
    toJSON() {
      return {
        success: this.success,
        message: this.message,
        data: this.data
      };
    }
  
    sendResponse(res) {
      res.status(this.statusCode).json(this.toJSON());
    }
  }
  
  module.exports = responseHandler;