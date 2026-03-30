# Version Control System

## Save Current Version
To save current state as a version:
```
node versions/save.js <version-name>
```
Example: `node versions/save.js v1-auth`

## Restore Version
To restore a specific version:
```
node versions/restore.js <version-name>
```
Example: `node versions/restore.js v1-auth`

## List Versions
```
node versions/list.js
```

## Current Saved Versions
| Version | Description | Date |
|---------|-------------|------|
| v1-base | Initial MERN project (no auth) | - |
| v2-jwt | With JWT authentication | - |