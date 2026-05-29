# Security Specification: ArcheoMind India Neural Network

## Data Invariants
1. **Artifact Integrity**: Every artifact must have an owner (`userId`), a name, and a civilization.
2. **Identity**: Users can only create artifacts in their own name unless they are admins.
3. **Immutable Fields**: `createdAt` and `userId` should not change after creation.
4. **Admin Escalation**: Only existing admins can promote other users to admin role.
5. **System Logs**: Audit logs and neural logs are append-only.

## The "Dirty Dozen" Payloads (Test Cases)
1. **Identity Spoofing**: User A tries to create an artifact with `userId` of User B. -> DENIED
2. **Shadow Update**: User A tries to update an artifact's `isVerified` field. -> DENIED (Only Admins)
3. **Ghost Field Injection**: User A tries to add `isAdmin: true` to their user profile. -> DENIED
4. **Resource Poisoning**: User A tries to set a 1MB string as an artifact ID. -> DENIED (ID validation)
5. **Orphaned Write**: User A tries to create a comment on a non-existent artifact. -> DENIED
6. **State Shortcutting**: User A tries to set `isVerified: true` during creation. -> DENIED (Unless Admin)
7. **Temporal Fraud**: User A tries to set a future `createdAt` timestamp. -> DENIED (Server timestamp required)
8. **Unauthenticated Write**: Guest tries to post in global chat. -> DENIED
9. **Role Escalation**: Regular researcher tries to update another user's role. -> DENIED
10. **Admin Mimicry**: User with email `kratosadmin@archeomind.ai.com` (fake) trying to pass as admin. -> DENIED (Regex/Exact match)
11. **Batch Poisoning**: User A tries to delete 10,000 artifacts in one batch. -> DENIED (Standard firestore limits + Rules)
12. **PII Leakage**: User A tries to read User B's private settings. -> DENIED

## Conflict Report
- **Identity Spoofing**: Multi-tier checks in `isValidArtifact`.
- **State Shortcutting**: `isVerified` restricted to `isAdmin()`.
- **Resource Poisoning**: `isValidId()` and `.size()` constraints on all strings.
