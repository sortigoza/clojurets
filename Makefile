all: deps test bundle

deps:
	npm install

test:
	npm test

fmt:
	npm run fmt

lint:
	npm run lint

autotest:
	make test OPTS=-w

bundle:
	# node build/clojure.js
	npm run build

.PHONY: deps test autotest bundle fmt lint
