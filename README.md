# Prompt Builder

A local-first prompt workspace. Write one request, optionally select controls,
then copy a deterministic prompt or inspect its portable JSON contract.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Set any control to `None` to keep it out of the
JSON output. The theme toggle switches between a white light mode and black
dark mode.

## Production

```bash
npm run build
npm start
```

The separate MCP server is in `../prompt_builder_mcp`.
