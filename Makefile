all: deps test bundle

deps:
	npm install

test:
	npm test

autotest:
	make test OPTS=-w

bundle:
	# node build/clojure.js
	npm run build

.PHONY: deps test autotest bundle
