import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { GoogleAuth } from 'google-auth-library'
import express from 'express'
import axios from 'axios'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'veo-proxy',
      configureServer(server) {
        const app = express()
        app.use(express.json())

        // In-memory cache: prompt → base64 video bytes. Persists for the lifetime of the dev server.
        const promptCache = new Map();
        const MAX_CACHE_SIZE = 20;

        let auth
        try {
          auth = new GoogleAuth({
            keyFilename: './hyperfounder-282235e8d09c.json',
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
          })
        } catch (e) {
          console.error("Failed to load Google credentials for Veo")
        }

        app.post('/api/veo/cache', (req, res) => {
          const { prompt, videoBytes } = req.body;
          if (prompt && videoBytes) {
            if (promptCache.size >= MAX_CACHE_SIZE) {
              // Evict oldest entry
              promptCache.delete(promptCache.keys().next().value);
            }
            promptCache.set(prompt, videoBytes);
          }
          res.json({ ok: true });
        });

        app.post('/api/veo/generate', async (req, res) => {
          try {
            const { prompt } = req.body

            if (promptCache.has(prompt)) {
              console.log('[Veo cache] HIT — returning cached video');
              return res.json({ cached: true, videoBytes: promptCache.get(prompt) });
            }

            const client = await auth.getClient()
            const token = await client.getAccessToken()

            const response = await axios.post(
              `https://us-central1-aiplatform.googleapis.com/v1beta1/projects/hyperfounder/locations/us-central1/publishers/google/models/veo-3.0-generate-preview:predictLongRunning`,
              {
                instances: [{ prompt }],
                parameters: {
                  aspectRatio: "16:9",
                  personGeneration: "ALLOW_ALL",
                  generateAudio: true,
                  durationSeconds: 5
                }
              },
              {
                headers: {
                  'Authorization': `Bearer ${token.token}`,
                  'Content-Type': 'application/json'
                }
              }
            )

            res.json(response.data)
          } catch (e) {
            console.error(e.response?.data || e.message)
            res.status(500).json({ error: e.response?.data?.error?.message || e.message })
          }
        })

        app.post('/api/imagen/generate', async (req, res) => {
          try {
            const { prompt } = req.body
            const client = await auth.getClient()
            const token = await client.getAccessToken()

            const response = await axios.post(
              `https://us-central1-aiplatform.googleapis.com/v1/projects/hyperfounder/locations/us-central1/publishers/google/models/imagen-3.0-generate-002:predict`,
              {
                instances: [{ prompt }],
                parameters: {
                  sampleCount: 1,
                  aspectRatio: "1:1"
                }
              },
              {
                headers: {
                  'Authorization': `Bearer ${token.token}`,
                  'Content-Type': 'application/json'
                }
              }
            )

            res.json(response.data)
          } catch (e) {
            console.error(e.response?.data || e.message)
            res.status(500).json({ error: e.response?.data?.error?.message || e.message })
          }
        })

        app.post('/api/veo/status', async (req, res) => {
          try {
            const { operationName } = req.body
            const client = await auth.getClient()
            const token = await client.getAccessToken()

            // The @google/genai SDK uses v1beta1 for Vertex AI, which supports UUID-based
            // operation IDs in fetchPredictOperation (unlike v1 which requires numeric Long IDs).
            const resourceName = operationName.split('/operations/')[0];
            const response = await axios.post(
              `https://us-central1-aiplatform.googleapis.com/v1beta1/${resourceName}:fetchPredictOperation`,
              { operationName },
              {
                headers: { 'Authorization': `Bearer ${token.token}`, 'Content-Type': 'application/json' }
              }
            )

            console.log("VEO STATUS POLLING DATA: ", JSON.stringify(response.data, null, 2))
            res.json(response.data)
          } catch (e) {
            console.error(e.response?.data || e.message)
            res.status(500).json({ error: e.response?.data?.error?.message || e.message })
          }
        })

        server.middlewares.use(app)
      }
    }
  ]
})
