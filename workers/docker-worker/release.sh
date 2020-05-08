#! /bin/bash

set -e

OUTPUT=docker-worker.tgz
while getopts "o:" opt; do
    case "${opt}" in
        o)  OUTPUT=$OPTARG
            ;;
    esac
done

DW_ROOT=$(mktemp -d)
trap "rm -rf $DW_ROOT" EXIT

# create an easy-to-use thing that will find the right paths, etc.
mkdir -p $DW_ROOT/bin
cat > $DW_ROOT/bin/docker-worker <<'EOF'
#! /bin/bash
DW_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null 2>&1 && pwd )"
NODE=$DW_ROOT/node/bin/node
exec $NODE $DW_ROOT/src/bin/worker.js "${@}"
EOF
chmod +x $DW_ROOT/bin/docker-worker

# install docker-worker itself
for f in src schemas .npmignore package.json yarn.lock config.yml bin-utils; do
    cp -r $PWD/$f $DW_ROOT
done

# Install Node
NODE_VERSION=12.11.0
mkdir $DW_ROOT/node
curl https://nodejs.org/dist/v13.14.0/node-v13.14.0-linux-x64.tar.xz | tar -C $DW_ROOT/node --strip-components=1 -xJf -

# Install dependencies
PATH=$DW_ROOT/node/bin:$DW_ROOT/node_modules/.bin:$PATH
(
    cd $DW_ROOT
    npm install yarn
    yarn install --dev
    npm uninstall yarn
)

# tar up the result..
tar -C $DW_ROOT --dereference --transform 's|^\./|docker-worker/|' -czf $OUTPUT .
