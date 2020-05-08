# Deployment

Docker worker is released as part of the full Taskcluster release cycle.
The release takes the form of a tarball, `docker-worker.tgz`, attached to the Taskcluster release on the GitHub repository.

## Release Format

The release tarball contains the docker-worker source and its dependencies as well as a copy of the correct Node version.
It has a top-level directory named `docker-worker` and the entry point to run the worker is `docker-worker/bin/docker-worker`.

The tarball can be extracted anywhere on the filesystem that is convenient.
