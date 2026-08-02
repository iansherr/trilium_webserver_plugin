# Contributing

Changes in this repository should remain specific to the Web Server package. Trilium host
infrastructure, the Plugins settings tab, and host-side tests belong in the separate
[Trilium repository](https://github.com/iansherr/Trilium), currently tested through
[`integration/plugins`](https://github.com/iansherr/Trilium/tree/integration/plugins).

Before submitting a change, validate `trilium-package.json`, keep artifact integrity hashes
in sync, and test the dashboard in the integrated Trilium branch when runtime behavior changes.
