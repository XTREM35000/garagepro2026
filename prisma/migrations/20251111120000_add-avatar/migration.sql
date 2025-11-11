-- Safe migration: add avatarUrl to User
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

-- optional index (uncomment to create)
-- CREATE INDEX IF NOT EXISTS "User_avatarUrl_idx" ON "User" ("avatarUrl");
