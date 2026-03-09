# Kabal

Kabal – Klage- og ankebehandling.

- [Kabal dev](https://kabal.intern.dev.nav.no/)
- [Kabal prod](https://kabal.intern.nav.no/)

## Project Structure

The project is a monorepo consisting of three main parts:

| Directory      | Description                        |
| -------------- | ---------------------------------- |
| `frontend/`    | Frontend                           |
| `server/`      | Backend-for-frontend (BFF)         |
| `file-viewer/` | Standalone file viewer application |

## Development

When running locally, the dev server proxies API requests to `kabal.intern.dev.nav.no`, so you use the same backend as the dev environment.

### Prerequisites

- [Bun](https://bun.sh/) (see `.tool-versions` for the expected version)
- [NAIS-device](https://doc.nais.io/device/) connected

### Running the frontend locally

1. Connect NAIS-device.
2. Log in at [kabal.intern.dev.nav.no](https://kabal.intern.dev.nav.no/) to establish an authenticated session.
3. Copy or transfer the session cookie `io.nais.wonderwall.session` to `localhost`.
4. Install dependencies and start the dev server:

```
cd frontend
bun install
bun run start
```

5. Open [localhost:8061](http://localhost:8061/).

> **Note:** `localhost:8061` will not redirect you to Azure AD login automatically.
