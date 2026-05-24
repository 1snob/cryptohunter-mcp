# CryptoHunter MCP Server

Live crypto data + local AI inference — pay-per-use via **x402 USDC on Base**. No API key, no account, no signup. AI agents pay directly.

## Live Endpoint

```
https://cryptohunterx402apis.loca.lt
```

## Tools

### Crypto Data Tools ($0.001 USDC each)

| Tool | Path | Description |
|------|------|-------------|
| `get_price` | `POST /crypto/tools/get_price` | Live USD price for any token(s) — BTC, ETH, SOL, etc. |
| `get_gas` | `POST /crypto/tools/get_gas` | Live gas prices on Base L2 + Ethereum mainnet |
| `get_balance` | `POST /crypto/tools/get_balance` | ETH balance of any EVM address on Base |
| `get_trending` | `POST /crypto/tools/get_trending` | Top 7 trending tokens from CoinGecko |
| `convert` | `POST /crypto/tools/convert` | Convert crypto/fiat at live rates |

### DeFi Premium Tools ($0.003 USDC each)

| Tool | Path | Description |
|------|------|-------------|
| `get_dex_quote` | `POST /crypto/tools/get_dex_quote` | Best swap quote via CoW Protocol DEX aggregation |
| `get_token_safety` | `POST /crypto/tools/get_token_safety` | Token honeypot + rug risk analysis via GoPlus Security |
| `get_portfolio` | `POST /crypto/tools/get_portfolio` | ETH balance + multi-token price summary for any wallet |

### AI Inference Tools (local Ollama, zero latency)

| Tool | Path | Price | Model |
|------|------|-------|-------|
| `ai_ask` | `POST /ai/ask` | $0.002 | Qwen2.5 3B — fast Q&A |
| `ai_code` | `POST /ai/code` | $0.003 | leandro-coder 7.6B — code review, debug, explain |
| `ai_reason` | `POST /ai/reason` | $0.005 | DeepSeek-R1 14.8B — chain-of-thought reasoning |
| `ai_embed` | `POST /ai/embed` | $0.001 | nomic 475M — semantic embeddings |

## Payment

- **Protocol**: x402 v2 (official Coinbase SDK)
- **Token**: USDC
- **Network**: Base mainnet (eip155:8453)
- **Facilitator**: https://facilitator.xpay.sh (public, 0% fee)
- **Receiver**: `0xC02491548e4052B88Ab5ddb6744Af7F35311081E`

## Usage

### Direct HTTP (x402-aware client)

```bash
# Get BTC price — x402-aware client handles payment automatically
curl -X POST https://cryptohunterx402apis.loca.lt/crypto/tools/get_price \
  -H "Content-Type: application/json" \
  -d '{"symbols": ["btc", "eth"]}'
```

### MCP Manifest

```
GET https://cryptohunterx402apis.loca.lt/crypto/manifest
```

### Discovery

```
GET https://cryptohunterx402apis.loca.lt/.well-known/x402.json
GET https://cryptohunterx402apis.loca.lt/.well-known/ai-agent.json
```

## Free Endpoints

- `GET /crypto/tools` — tool catalog with prices
- `GET /crypto/health` — service health
- `GET /ai/models` — AI model catalog
- `GET /ai/health` — Ollama health check
- `GET /health` — overall service health
- `GET /.well-known/x402.json` — Coinbase Bazaar manifest
- `GET /.well-known/ai-agent.json` — Aiia/agent.market manifest

## Status

- Registered on [402index.io](https://402index.io) — domain verified, auto-crawled hourly
- Listed in [awesome-x402](https://github.com/xpaysh/awesome-x402)
