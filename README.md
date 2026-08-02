# Trilium Web Server plugin

This package adds a standalone Web Server dashboard for Trilium.

It shows:

- whether the instance is responding;
- network-reachable connection addresses;
- the ETAPI base address;
- backend scripting, SQL console, and desktop LAN-access flags; and
- links to the native ETAPI and Security settings pages.

The package does not edit `config.ini`, environment variables, certificates, or the running listener. Host, port, HTTPS, reverse-proxy, and CORS changes still require the deployment configuration and a restart.

## Package boundary

This repository contains only the Web Server package: its manifest and dashboard artifacts.
The host-side package manager, Plugins settings tab, lifecycle locking, and Trilium tests
live separately in the [Trilium integration branch](https://github.com/iansherr/Trilium/tree/integration/plugins).
That branch does not bundle this repository or replace it; it is the current development
and end-to-end testing environment until the host changes are accepted upstream.

After enabling the package, the dashboard is available from the installed package subtree. Its launch-bar entry is disabled until the package is enabled; when enabled, it appears as **Web Server** in the launch bar.

## FAQ

### Is this the Trilium application?

No. This is an independently versioned Trilium package. Trilium provides the host runtime
and package manager.

### Which Trilium version should be used for testing?

Use the separate [`integration/plugins` branch](https://github.com/iansherr/Trilium/tree/integration/plugins)
for current package-manager testing. It is experimental and is not a production release.

### Is the integration branch included in this package?

No. The branch contains Trilium-side infrastructure and tests; this repository contains the
Web Server package payload.
