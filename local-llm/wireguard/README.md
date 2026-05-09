# WireGuard VPN for accessing local services

When you self-host an LLM (or anything else) on your home / office network, you'll want to reach it from elsewhere — laptop on a plane, friend's house. WireGuard is the most boring, fastest modern VPN.

The technique applies to **any local service**, not just an LLM.

## Where to run the WireGuard server

- **Your router** — OpenWRT, OPNsense, and most prosumer routers support WireGuard natively. Lowest overhead.
- **A box on your LAN** — a Raspberry Pi or always-on Mac running `wg-quick`. Needs a port forward on your router.
- **A cloud VPS** — for when you don't have a static IP at home and don't want to deal with dynamic DNS.

## Server side (OpenWRT example)

```bash
opkg update
opkg install wireguard-tools luci-app-wireguard
```

Generate keys, define a peer subnet (e.g., `10.0.0.0/24`), open the UDP port on the WAN firewall, and add a peer entry per client.

## Client side (macOS)

1. Install [WireGuard from the Mac App Store](https://apps.apple.com/us/app/wireguard/id1451685025).
2. Add a tunnel from a QR code, or paste a config:

   ```ini
   [Interface]
   PrivateKey = <client-private-key>
   Address = 10.0.0.X/24
   DNS = 10.0.0.1

   [Peer]
   PublicKey = <server-public-key>
   AllowedIPs = 10.0.0.0/24
   Endpoint = your.host:port
   PersistentKeepalive = 25
   ```

3. Toggle on. From there your laptop reaches anything on the WG subnet.

## Reaching your local LLM

Tunnel up: point your editor / agent at `http://<lan-ip>:11434/v1` (Ollama) or `:8080/v1` (MLX-LM). Most clients don't care that the host isn't `localhost`.

## Firewall best practices

- **Default deny on the WAN**. Only the WireGuard UDP port should be reachable from outside.
- **Don't port-forward Ollama / MLX-LM directly**. They have no auth — port-forwarding exposes them to the world.
- **`AllowedIPs` per peer**. Set it to your subnet (e.g., `10.0.0.0/24`), not `0.0.0.0/0`, unless you actually want to route all traffic through home.
- **Per-peer keys, not shared**. Each client gets its own keypair. Rotating one doesn't affect others.
- **Preshared keys (`PresharedKey =`)** for quantum-resistant defense in depth. Optional, cheap to add.
- **Keys in Keychain / password manager**, never in git.
- **Disable IPv6 on the tunnel** unless you've explicitly configured it; mismatched IPv6 routing is a frequent source of "VPN looks up but I can't reach anything."
