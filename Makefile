karma := node_modules/karma/bin/karma
karma_config := karma.conf.js

test:
	@$(karma) start $(karma_config) --no-watch --single-run

start_test:
	@$(karma) start $(karma_config)
