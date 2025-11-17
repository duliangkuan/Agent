// Zhipu AI (GLM) platform client
const axios = require('axios');

class GLMClient {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseURL = options.baseURL || 'https://open.bigmodel.cn/api/paas/v4';
    this.model = options.model || 'glm-4';
    this.timeout = options.timeout || 30000;
  }

  async sendMessage(message, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: options.model || this.model,
          messages: [
            { role: 'user', content: message }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: this.timeout,
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
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

module.exports = GLMClient;

