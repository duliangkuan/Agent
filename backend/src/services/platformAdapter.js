// Platform adapter - unified interface supporting multiple platforms
const OpenAIClient = require('./platforms/openaiClient');
const GLMClient = require('./platforms/glmClient');
const ClaudeClient = require('./platforms/claudeClient');

class PlatformAdapter {
  constructor(platform, apiKey, apiEndpoint = null, options = {}) {
    this.platform = platform.toLowerCase();
    this.apiKey = apiKey;
    this.apiEndpoint = apiEndpoint;
    this.options = options;

    // Create corresponding client based on platform
    switch (this.platform) {
      case 'openai':
      case 'gpt':
        this.client = new OpenAIClient(apiKey, { ...options, baseURL: apiEndpoint });
        break;
      case 'glm':
      case 'zhipu':
        this.client = new GLMClient(apiKey, { ...options, baseURL: apiEndpoint });
        break;
      case 'claude':
      case 'anthropic':
        this.client = new ClaudeClient(apiKey, { ...options, baseURL: apiEndpoint });
        break;
      default:
        // Generic client (using custom endpoint)
        this.client = this.createGenericClient(apiKey, apiEndpoint, options);
    }
  }

  createGenericClient(apiKey, apiEndpoint, options) {
    // Generic HTTP client
    const axios = require('axios');
    return {
      async sendMessage(message, opts = {}) {
        try {
          const response = await axios.post(
            apiEndpoint || 'https://api.example.com/chat',
            {
              message: message,
              ...opts,
            },
            {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              timeout: options.timeout || 30000,
            }
          );

          return {
            success: true,
            content: response.data.content || response.data.message || response.data.text,
            data: response.data,
          };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.error?.message || error.message,
            statusCode: error.response?.status,
          };
        }
      },
    };
  }

  async sendMessage(message, options = {}) {
    return await this.client.sendMessage(message, options);
  }

  async testResponse(testPrompt, options = {}) {
    if (this.client.testResponse) {
      return await this.client.testResponse(testPrompt, options);
    } else {
      const startTime = Date.now();
      const result = await this.client.sendMessage(testPrompt, options);
      const responseTime = Date.now() - startTime;

      return {
        ...result,
        responseTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async batchTest(prompts, options = {}) {
    const results = [];
    for (const prompt of prompts) {
      const result = await this.testResponse(prompt, options);
      results.push(result);
      // Avoid requests too fast
      await new Promise(resolve => setTimeout(resolve, options.delay || 500));
    }
    return results;
  }
}

module.exports = PlatformAdapter;

