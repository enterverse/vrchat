# Memory Adapter

The memory adapter stores accounts in a map that will be lost after runtime. Helpful for quick development scenarios. Not ideal in production though because VRChat accounts have a limit to the amount of active login session they can have. 

## Installation
```ts
import MemoryStorageAdapter from "@enterlink/vrchat/adapter/memory";
```

> Note: the import will not function if tsconfig has module resolution on an unsupported version.

## Usage

```ts
import MemoryStorageAdapter from "@enterlink/vrchat/adapter/memory";

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
```

> It is highly recommended to use an adapter that will persist session states across restarts. VRChat has a limit to how many active sessions an account can have.
