module.exports = {
  apps: [
    {
      script: "./index.js",
      name: "app",
      exec_mode: "cluster",
      instances: 4,
    },
  ],
  deploy: {
    production: {
      user: "kshitij",
      host: "localhost",
      ref: "origin/main",
      repo: "git@github.com:kshitijv256/Todo-App-JS.git",
      path: "/home/kshitij/workspace/web/Todo-App-JS",
      "post-deploy":
        "npm install && pm2 startOrRestart ecosystem.config.js --env production",
    },
  },
};
