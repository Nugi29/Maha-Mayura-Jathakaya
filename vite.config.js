import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom middleware to run our Serverless Function inside Vite locally
function apiMiddleware() {
  return {
    name: 'api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/messages', async (req, res) => {
        // Dynamically import the handler so it doesn't cause build issues on Vercel
        const { default: apiHandler } = await import('./api/messages.js');

        // Vercel helper polyfills
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              req.body = JSON.parse(body);
              await apiHandler(req, res);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              res.status(400).json({ error: 'Invalid JSON' });
            }
          });
        } else {
          await apiHandler(req, res);
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiMiddleware()
  ],
})
