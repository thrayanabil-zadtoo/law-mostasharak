import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { lawGatewayRouter } from './server/lawGatewayRoutes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api/law', lawGatewayRouter);

  // Serve public directory for widget and static assets
  app.use(express.static(path.resolve(__dirname, 'public')));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In dev mode, mount Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[LAW Mostasharak] Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
