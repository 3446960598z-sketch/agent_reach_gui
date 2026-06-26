.PHONY: help serve doctor search code web github youtube v2ex bili twitter reddit xhs update-check command run package check

QUERY ?=
URL ?=
ID ?=
USER ?=
REPO ?=
NODE ?= python
PORT ?= 4173
ARGS ?=

help:
	node scripts/agent-reach-cli.js help

serve:
	node server.js

doctor:
	node scripts/agent-reach-cli.js run doctor

search:
	node scripts/agent-reach-cli.js run exa-web --query "$(QUERY)"

code:
	node scripts/agent-reach-cli.js run exa-code --query "$(QUERY)"

web:
	node scripts/agent-reach-cli.js run jina-read --url "$(URL)"

github:
	node scripts/agent-reach-cli.js run github-repos --query "$(QUERY)"

youtube:
	node scripts/agent-reach-cli.js run youtube-subs --url "$(URL)"

v2ex:
	node scripts/agent-reach-cli.js run v2ex-hot

bili:
	node scripts/agent-reach-cli.js run bili-search --query "$(QUERY)"

twitter:
	node scripts/agent-reach-cli.js run twitter-search --query "$(QUERY)"

reddit:
	node scripts/agent-reach-cli.js run reddit-search --query "$(QUERY)"

xhs:
	node scripts/agent-reach-cli.js run xhs-search --query "$(QUERY)"

update-check:
	node scripts/agent-reach-cli.js run update-check

command:
	node scripts/agent-reach-cli.js command $(ID) $(ARGS)

run:
	node scripts/agent-reach-cli.js run $(ID) $(ARGS)

check:
	node scripts/check.js

package:
	node scripts/package.js
