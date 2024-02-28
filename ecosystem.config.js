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
      host: "127.0.0.1",
      ref: "origin/main",
      repo: "git@github.com:kshitijv256/Todo-App-JS.git",
      path: "/home/kshitij/Todo-App-JS",
      "post-deploy":
        "npm install && pm2 startOrRestart ecosystem.config.js --env production",
    },
  },
};
