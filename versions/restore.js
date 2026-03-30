const fs = require('fs');
const path = require('path');

const VERSIONS_DIR = path.join(__dirname, 'backups');
const PROJECT_ROOT = path.join(__dirname, '..');

const versionName = process.argv[2];
if (!versionName) {
  console.error('Usage: node restore.js <version-name>');
  console.error('Available versions:');
  listVersions();
  process.exit(1);
}

const versionPath = path.join(VERSIONS_DIR, versionName);

if (!fs.existsSync(versionPath)) {
  console.error(`Version "${versionName}" not found.`);
  console.error('Available versions:');
  listVersions();
  process.exit(1);
}

// First save current as a backup before restoring
const timestamp = Date.now();
const tempBackup = path.join(__dirname, 'backups', `_temp_before_restore_${timestamp}`);
console.log('📦 Creating temporary backup of current state...');
copyDir(PROJECT_ROOT, tempBackup, ['versions', 'backups']);
console.log('✅ Backup saved');

// Remove current project files
const dirsToRemove = ['backend', 'frontend'];
for (const dir of dirsToRemove) {
  const dirPath = path.join(PROJECT_ROOT, dir);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// Restore version
console.log(`📥 Restoring version "${versionName}"...`);
for (const dir of dirsToRemove) {
  const srcDir = path.join(versionPath, dir);
  const destDir = path.join(PROJECT_ROOT, dir);
  if (fs.existsSync(srcDir)) {
    copyDir(srcDir, destDir);
  }
}

console.log(`✅ Version "${versionName}" restored successfully`);
console.log('');
console.log('To start working with this version:');
console.log('  cd backend && npm install && node index.js');
console.log('  cd frontend && npm install && npm run dev');

function listVersions() {
  if (!fs.existsSync(VERSIONS_DIR)) {
    console.log('  No versions saved yet.');
    return;
  }
  const versions = fs.readdirSync(VERSIONS_DIR).filter(v => !v.startsWith('_'));
  if (versions.length === 0) {
    console.log('  No versions saved yet.');
  } else {
    versions.forEach(v => {
      const metaPath = path.join(VERSIONS_DIR, v, 'metadata.json');
      if (fs.existsSync(metaPath)) {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        console.log(`  - ${v} (${meta.date.split('T')[0]})`);
      } else {
        console.log(`  - ${v}`);
      }
    });
  }
}

function copyDir(src, dest, exclude = []) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}