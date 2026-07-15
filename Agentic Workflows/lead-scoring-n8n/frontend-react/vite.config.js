import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base is set for GitHub Pages project-site hosting:
// https://<user>.github.io/AI-PM-Portfolio/lead-scoring-frontend/
export default defineConfig({
  plugins: [react()],
  base: './',
});
