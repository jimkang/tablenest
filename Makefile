test:
	node tests/basictests.js
	node tests/resolve-later-tests.js

pushall:
	git push origin master && npm publish

prettier:
	prettier --single-quote --write "**/*.js"
