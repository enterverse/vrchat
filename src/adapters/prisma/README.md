# Prisma Adapter

The prisma adapter will use prisma to store session information in a database. This is recommended for production use.

## Installation

Add the contents of [schema.prisma](./schema.prisma) to your database schema and create a migration.

```ts
import PrismaStorageAdapter from "@enterlink/vrchat/adapter/prisma";
```

> Note: the import will not function if tsconfig has module resolution on an unsupported version.

## Usage

```ts
import PrismaStorageAdapter from "@enterlink/vrchat/adapter/prisma";

// const prismaDatabase = new PrismaClient();

const adapter = new PrismaStorageAdapter(prismaDatabase);
```