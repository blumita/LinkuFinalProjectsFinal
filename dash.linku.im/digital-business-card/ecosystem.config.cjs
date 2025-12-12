module.exports = {
  apps: [
    {
      name: 'dash-linku',
      script: './.output/server/index.mjs',
      cwd: '/var/www/dash.linku.im/digital-business-card',
      instances: 1,
      exec_mode: 'fork',
      node_args: '--max-old-space-size=2048',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/root/.pm2/logs/dash-linku-error.log',
      out_file: '/root/.pm2/logs/dash-linku-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1500M',
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    }
  ]
}
