TESTS = test/*.js
REPORTER = spec

test:
	@./node_modules/.bin/mocha \
		--require chai \
		--reporter $(REPORTER) \
		--growl \
		$(TESTS)

.PHONY: test bench
