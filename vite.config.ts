import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ['@mui/material', '@mui/system', '@mui/icons-material', '@mui/styled-engine'],
  },
  build: {
    outDir: 'dist',
  },
});
