FROM node:22-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev
RUN npx playwright install --with-deps chromium

# Pre-download the NLP model so it never fetches at runtime
RUN mkdir -p .models && \
    node -e "const { pipeline, env } = require('@xenova/transformers'); env.cacheDir = './.models'; pipeline('zero-shot-classification', 'Xenova/nli-deberta-v3-xsmall').then(() => { console.log('NLP Model cached successfully'); process.exit(0); }).catch(e => { console.error('NLP Model download failed:', e); process.exit(1); });"

COPY . .

ENV NODE_ENV=production

CMD ["node", "index.js"]