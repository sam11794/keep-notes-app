const fs = require('fs');
const path = require('path');

const VERSIONS_DIR = path.join(__dirname, 'backups');
const PROJECT_ROOT = path.join(__dirname, '..');

if (!fs.existsSync(VERSIONS_DIR)) {
  fs.mkdirSync(VERSIONS_DIR, { recursive: true });
}

const versionName = process.argv[2];
if (!versionName) {
  console.error('Usage: node save.js <version-name>');
  process.exit(1);
}

const versionPath = path.join(VERSIONS_DIR, versionName);

if (fs.existsSync(versionPath)) {
  console.error(`Version "${versionName}" already exists. Use a different name or delete first.`);
  process.exit(1);
}

fs.mkdirSync(versionPath, { recursive: true });

const dirsToBackup = ['backend', 'frontend'];

for (const dir of dirsToBackup) {
  const srcDir = path.join(PROJECT_ROOT, dir);
  const destDir = path.join(versionPath, dir);

  if (fs.existsSync(srcDir)) {
    copyDir(srcDir, destDir);
  }
}

// Save metadata
const metadata = {
  name: versionName,
  date: new Date().toISOString(),
  description: process.argv[3] || ''
};
fs.writeFileSync(path.join(versionPath, 'metadata.json'), JSON.stringify(metadata, null, 2));

console.log(`✅ Version "${versionName}" saved successfully`);

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}