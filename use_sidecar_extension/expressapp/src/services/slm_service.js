const axios = require('axios');

/**
 * Service for interacting with the Small Language Model API
 */
class SLMService {
  constructor() {
    // Using explicit IP 127.0.0.1 instead of 'localhost' to avoid IPv6 resolution issues in Node.js
    // Node.js tries to connect via IPv6 (::1) first when using 'localhost', which can fail
    // in containerized environments like Azure App Service.
    this.apiUrl = 'http://127.0.0.1:11434/v1/chat/completions';
  }

  /**
   * Stream chat completions from the SLM API
   * @param {string} prompt - The prompt to send to the model
   * @param {object} res - The Express response object for streaming
   */
  async streamChatCompletions(prompt, res) {
    const requestPayload = {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      stream: true,
      cache_prompt: false,
      n_predict: 2048 // Increased token limit to allow longer responses
    };

    try {
      // Set up Server-Sent Events headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const response = await axios.post(this.apiUrl, requestPayload, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'stream'
      });

      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          let parsedLine = line;
          if (line.startsWith('data: ')) {
            parsedLine = line.replace('data: ', '').trim();
          }
          
          if (parsedLine === '[DONE]') {
            return;
          }
          
          try {
            const jsonObj = JSON.parse(parsedLine);
            if (jsonObj.choices && jsonObj.choices.length > 0) {
              const delta = jsonObj.choices[0].delta || {};
              const content = delta.content;
              
              if (content) {
                // Use non-breaking space to preserve formatting
                const formattedToken = content.replace(/ /g, '\u00A0');
                res.write(`data: ${formattedToken}\n\n`);
              }
            }
          } catch (parseError) {
            console.warn(`Failed to parse JSON from line: ${parsedLine}`);
          }
        }
      });

      response.data.on('end', () => {
        res.write(`event: complete\ndata: ""\n\n`);
        res.end();
      });

      response.data.on('error', (err) => {
        console.error('Error streaming from API:', err);
        res.write(`event: error\ndata: ${err.message}\n\n`);
        res.end();
      });
    } catch (error) {
      console.error('Error connecting to language model API:', error);
      res.write(`event: error\ndata: Service unavailable: cannot connect to language model API\n\n`);
      res.end();
    }
  }
}

module.exports = SLMService;