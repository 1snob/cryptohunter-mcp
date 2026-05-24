#!/usr/bin/env node
/**
 * CryptoHunter MCP — npm launcher
 *
 * Runs a local stdio↔HTTP bridge so any MCP client (Claude Desktop,
 * Cursor, etc.) can connect to the remote CryptoHunter server using
 * the standard stdio transport.
 *
 * Usage:  npx @cryptohunter/mcp-server
 * Or add to Claude Desktop config:
 *   "cryptohunter": { "command": "npx", "args": ["-y", "@cryptohunter/mcp-server"] }
 */

const https = require('https');
const http = require('http');
const readline = require('readline');

const SERVER_URL = process.env.CRYPTOHUNTER_URL || 'https://cryptohunterx402apis.loca.lt';

// Pass-through MCP server: relay JSON-RPC over stdio to the remote HTTP endpoint
const rl = readline.createInterface({ input: process.stdin, terminal: false });
let buf = '';

rl.on('line', (line) => {
  buf += line;
  try {
    const msg = JSON.parse(buf);
    buf = '';
    handleMessage(msg);
  } catch {
    // incomplete JSON, keep buffering
  }
});

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

function handleMessage(msg) {
  // Handle MCP initialize locally — announce we're a remote proxy
  if (msg.method === 'initialize') {
    return send({
      jsonrpc: '2.0',
      id: msg.id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'cryptohunter-mcp', version: '1.2.0' },
      },
    });
  }

  // Forward all other requests to remote server
  const url = new URL('/mcp/jsonrpc', SERVER_URL);
  const body = JSON.stringify(msg);
  const mod = url.protocol === 'https:' ? https : http;
  const req = mod.request(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'bypass-tunnel-reminder': 'true',
      },
    },
    (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          send(JSON.parse(data));
        } catch {
          send({ jsonrpc: '2.0', id: msg.id, error: { code: -32603, message: 'Bad response from server' } });
        }
      });
    },
  );
  req.on('error', (e) => {
    send({ jsonrpc: '2.0', id: msg.id, error: { code: -32603, message: e.message } });
  });
  req.write(body);
  req.end();
}

process.stderr.write(`CryptoHunter MCP bridge → ${SERVER_URL}\n`);
