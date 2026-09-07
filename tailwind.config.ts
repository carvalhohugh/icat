import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        icat: {
          green: {
            DEFAULT: '#009B3A',
            dark: '#006B2D',
          },
          blue: {
            DEFAULT: '#0057B8',
            dark: '#003B73',
          },
          yellow: {
            DEFAULT: '#FFCC00',
          },
          gray: {
            light: '#F4F6F8',
            dark: '#1F2937',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
