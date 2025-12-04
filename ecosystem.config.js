module.exports = {
    apps: [{
            name: 'dash-linku',
            script: '.output/server/index.mjs',
            cwd: '/var/www/dash.linku.im/digital-business-card',
            instances: 1,
            exec_mode: 'cluster',
            node_args: '--max-old-space-size=2048', // 2GB memory
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            max_memory_restart: '2G',
            error_file: 'logs/dash-linku-error.log',
            out_file: 'logs/dash-linku-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
        },
        {
            name: 'dash-admin',
            script: 'npm',
            args: 'run preview',
            cwd: '/var/www/dash.linku.im/admin-dashboard',
            instances: 1,
            exec_mode: 'fork',
            node_args: '--max-old-space-size=1024', // 1GB memory
            env: {
                NODE_ENV: 'production',
                PORT: 5173
            },
            max_memory_restart: '1G',
            error_file: 'logs/dash-admin-error.log',
            out_file: 'logs/dash-admin-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
        }
    ]
}