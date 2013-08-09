src := statemachine.js
minsrc := statemachine.min.js

build:
	@curl -s --data-urlencode js_code@$(src) \
		--data-urlencode output_info=compiled_code \
		--header "Content-type: application/x-www-form-urlencoded" \
		--output $(minsrc) \
		http://closure-compiler.appspot.com/compile

karma := node_modules/karma/bin/karma
karma_config := karma.conf.js

test:
	@$(karma) start $(karma_config) --no-watch --single-run

start_test:
	@$(karma) start $(karma_config)
