# vrchat
Hand written package for the VRChat API applicable to more scenarios.

## Installation

```bash
yarn add @enterlink/vrchat
```
## Usage
> Currently the package will only function with accounts that have a totp enabled.

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
  let user = await pooler.get<CurrentUser>(Routes.currentUser());
  console.log("Logged in as", user.displayName);

  user = await pooler.get(Routes.currentUser());
  console.log("Logged in as", user.displayName);

  user = await pooler.get(Routes.currentUser());
  console.log("Logged in as", user.displayName);
})().catch(console.error);

```

## Backlog
- [ ] Implement Prisma adapter for our use case.
- [ ] Implement all API endpoints (see [src/api.ts](./src/api.ts)).
- [ ] Support for accounts all 2fa types (see [src/client.ts](https://github.com/enterverse/vrchat/blob/a79da93e58316c469e9478ab7051070faa1d77e4/src/client.ts#L256)).
- [ ] Support setting ratelimits.
- [ ] Way to select an account to use in pooler.
- [ ] Pooler single account transactions.
