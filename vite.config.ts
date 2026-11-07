import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Relative paths work on both /capital-district/ and a custom domain.
export default defineConfig({ plugins: [react()], base: './' });
