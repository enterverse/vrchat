# vrchat
VRChat API package focused on abstracting session management.

## Installation

```bash
yarn add @enterlink/vrchat
```
## Usage
> Accounts with no totp key must define a ClientOptions#onRequestOtpKey for fetching the relevant otp.

```ts
import { Client, CurrentUser, Routes, World } from "@enterlink/vrchat";

const client = new Client({
  email: 'email@example.com',
  password: 'some-secret-password',
  totpKey: 'totp-private-key'
});

;(async () => {
  const user = await client.get<CurrentUser>(Routes.currentUser());
  console.log("Logged in as", user.displayName);

  const world = await client.get<World>(Routes.world("wrld_2851d12c-57d0-4754-84cf-aa494ce7a03a"));
  console.log("Found World:", world.name);

  await client.put(Routes.logout());
  console.log("Logged out!");
})().catch(console.error);

```

### Pooled Usage Example
Our specfic scenario demands us having a pool of accounts. You can achieve this  with using the pooler. The pooler expects a constructed implementation of `StorageAdapter`. In this example we will use the [Memory Adapter](./src/adapters/memory).

> It is highly recommended to use an adapter that will persist session states across restarts. VRChat has a limit to how many active sessions an account can have.

```ts
import { CurrentUser, Pooler, Routes } from "@enterlink/vrchat";
import { MemoryStorageAdapter } from '@enterlink/vrchat/adapter/memory';

const adapter = new MemoryStorageAdapter([
  {
    email: 'email@example.com',
    password: 'some-secret-password',
    totpKey: 'totp-private-key'
  },
  {
    email: 'email2@example.com',
    password: 'some-secret-password',
    totpKey: 'totp-private-key'
  },
  {
    email: 'email3@example.com',
    password: 'some-secret-password',
    totpKey: 'totp-private-key'
  }
]);

const pooler = new Pooler(adapter);

;(async () => {
  const users = await pooler.getAll<CurrentUser>(Routes.currentUser());

  for (const user of users) {
    console.log("Logged in as:", user.displayName);
  }

  await pooler.putAll(Routes.logout());
  console.log("Logged out all users");
})().catch(console.error);

```

## Notes
We use `otplib` internally for generating TOTP codes. I've noticed that on Node.js versions 20 and 21, authentication failures occur because one of `otplib`'s dependencies, `thirty-two`, uses `new Buffer()` internally. This results in a Node.js error: `TypeError: Cannot read properties of undefined (reading '0')`. Since there isn't a straightforward fix for this issue, we are running Node.js v22+ to avoid the problem.

## Backlog
- [x] Implement Prisma adapter for our use case.
- [x] Prisma adapter optional encryption.
- [x] Way to select an account to use in pooler.
- [x] Way to request on all accounts in pooler.
- [x] Support for accounts all 2fa types (see [src/client.ts](./src/client.ts)).
- [ ] Implement all API endpoints (see [src/api.ts](./src/api.ts)).
- [ ] Support setting ratelimits.
- [ ] Pooler single account transactions.
