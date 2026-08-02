import { Admonition, Button, LoadingSpinner, useEffect, useState } from "trilium:preact";

const ETAPI_SETTINGS_NOTE_ID = "_optionsEtapi";
const SECURITY_SETTINGS_NOTE_ID = "_optionsSecurity";

export default function WebServerDashboard() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState("");

    async function refresh() {
        setLoading(true);
        setError("");
        try {
            const [healthResponse, networkResponse, optionsResponse] = await Promise.all([
                fetch("/api/health-check"),
                fetch("/api/network-addresses"),
                fetch("/api/options")
            ]);
            for (const response of [healthResponse, networkResponse, optionsResponse]) {
                if (!response.ok) throw new Error(`Trilium returned HTTP ${response.status}`);
            }
            const [health, network, options] = await Promise.all([
                healthResponse.json(),
                networkResponse.json(),
                optionsResponse.json()
            ]);
            setStatus({ health, network, options });
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : String(cause));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void refresh();
    }, []);

    async function copyAddress(address) {
        try {
            await navigator.clipboard.writeText(address);
            setCopied(address);
            window.setTimeout(() => setCopied(""), 1500);
        } catch {
            setError("Could not copy the address. Select it and copy it manually.");
        }
    }

    const network = status?.network;
    const options = status?.options || {};
    const addresses = network?.addresses || [];
    const localAddress = addresses[0] || window.location.origin;

    return (
        <div style={{ maxWidth: "850px", padding: "1.5em" }}>
            <h1>Web Server</h1>
            <p>See how this Trilium instance is exposed and find the addresses used by ETAPI clients.</p>

            {error && <Admonition type="warning">{error}</Admonition>}
            {loading && !status && <LoadingSpinner />}

            {status && <>
                <section>
                    <h2>Status</h2>
                    <p><strong>{status.health?.status === "ok" ? "Running" : "Unavailable"}</strong></p>
                    <p>{network?.reachableOnNetwork
                        ? "This instance is bound to a network-reachable address."
                        : "This instance appears to be local-only; other devices may not be able to connect."}</p>
                    <Button text={loading ? "Refreshing…" : "Refresh status"} size="small" onClick={() => void refresh()} disabled={loading} />
                </section>

                <section>
                    <h2>Connection addresses</h2>
                    {addresses.length ? addresses.map((address) => (
                        <div key={address} style={{ display: "flex", alignItems: "center", gap: "0.75em", margin: "0.5em 0" }}>
                            <code style={{ flex: 1, overflowWrap: "anywhere" }}>{address}</code>
                            <Button text={copied === address ? "Copied" : "Copy"} size="small" onClick={() => void copyAddress(address)} />
                        </div>
                    )) : <p>No network address was reported.</p>}
                    <p>ETAPI endpoint: <code>{localAddress}/etapi</code></p>
                </section>

                <section>
                    <h2>Security and scripting</h2>
                    <p>These flags describe the running instance. Changes to server configuration require editing the server configuration and restarting Trilium.</p>
                    <dl>
                        <dt>Backend scripting</dt>
                        <dd>{yesNo(options.backendScriptingEnabled)}</dd>
                        <dt>SQL console</dt>
                        <dd>{yesNo(options.sqlConsoleEnabled)}</dd>
                        <dt>Desktop LAN access</dt>
                        <dd>{yesNo(options.allowLanAccess)}</dd>
                    </dl>
                    <div style={{ display: "flex", gap: "0.5em", flexWrap: "wrap" }}>
                        <Button text="Open ETAPI settings" size="small" onClick={() => void api.activateNote(ETAPI_SETTINGS_NOTE_ID)} />
                        <Button text="Open Security settings" size="small" onClick={() => void api.activateNote(SECURITY_SETTINGS_NOTE_ID)} />
                    </div>
                </section>

                <section>
                    <h2>Configuration</h2>
                    <p>Host, port, HTTPS, reverse-proxy, and CORS settings are controlled by the server’s <code>config.ini</code> or environment variables. They are intentionally not changed by this plugin because the running listener must be restarted safely.</p>
                    <p>For a desktop instance, use Security settings for LAN access. For a server deployment, use the deployment’s configuration or environment file.</p>
                </section>
            </>}
        </div>
    );
}

function yesNo(value) {
    return value === "true" ? "Enabled" : "Disabled";
}
