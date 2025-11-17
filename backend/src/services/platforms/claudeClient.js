// Anthropic Claude platform client
const axios = require('axios');

class ClaudeClient {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseURL = options.baseURL || 'https://api.anthropic.com/v1';
    this.model = options.model || 'claude-3-opus-20240229';
    this.timeout = options.timeout || 30000;
  }

  async sendMessage(message, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/messages`,
        {
          model: options.model || this.model,
          max_tokens: options.max_tokens || 1024,
          messages: [
            { role: 'user', content: message }
          ],
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          timeout: this.timeout,
        }
      );

      return {
        success: true,
        content: response.data.content[0].text,
        usage: response.data.usage,
        model: response.data.model,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        statusCode: error.response?.status,
      };
    }
  }

  async testResponse(testPrompt, options = {}) {
    const startTime = Date.now();
    const result = await this.sendMessage(testPrompt, options);
    const responseTime = Date.now() - startTime;

    return {
      ...result,
      responseTime,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = ClaudeClient;

