test:
	node tests/basictests.js
	node tests/resolve-later-tests.js
	node tests/literal-tests.js
	node tests/abbreviation-tests.js

pushall:
	git push origin master && npm publish

prettier:
	prettier --single-quote --write "**/*.js"

slimes:
	node tools/run-def.js tests/fixtures/slime-def.js

layouts:
	node tools/run-def.js tests/fixtures/layout-def.js

