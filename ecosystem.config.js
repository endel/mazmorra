/* PM2 config file */

module.exports = {
	apps : [{
		name      : 'mazmorra.io',
		script    : 'server/index.js',
		watch     : true,
		instances : 'max',
		env: {
			NODE_ENV: 'development'
		},
		env_production : {
			NODE_ENV: 'production'
		}
	}],

	deploy : {
		production : {
			user : 'root',
			host : ['138.197.97.91'],
			ref  : 'origin/master',
			repo : 'git@github.com:endel/mazmorra.git',
			path : '/root/mazmorra',
			'post-deploy' : 'yarn install && yarn build && pm2 startOrRestart ecosystem.config.js --env production'
		}
	}
};
