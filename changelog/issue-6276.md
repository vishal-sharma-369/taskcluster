audience: users
level: patch
reference: issue 6276
---
Generic Worker no longer uses locally cached Indexed Artifact content without first checking whether the Index has been updated since the local content was cached.
Previously, if a task mounted indexed artifact content from a namespace/artifact name that had previously been downloaded, it would reuse this content without
first checking whether the artifact was still current. Now generic-worker will check what the taskID is under the given index namespace, and if it has changed
since the previous download, it will download the new version of the artifact from the current taskId that is stored in the index under the given namespace.
