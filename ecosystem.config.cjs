module.exports = {
  apps: [
    {
      name: 'prado-nuxt-3000',
      cwd: '/Users/theodoreriant/Documents/04_Projets/01_Actifs/prado-nuxt',
      script: 'node_modules/nuxt/bin/nuxt.mjs',
      args: 'dev --port 3000',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
