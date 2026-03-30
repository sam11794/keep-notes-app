const fs = require('fs');
const path = require('path');

const VERSIONS_DIR = path.join(__dirname, 'backups');

console.log('\n📦 Saved Versions\n' + '─'.repeat(40));

if (!fs.existsSync(VERSIONS_DIR)) {
  fs.mkdirSync(VERSIONS_DIR, { recursive: true });
}

const versions = fs.readdirSync(VERSIONS_DIR).filter(v => !v.startsWith('_'));

if (versions.length === 0) {
  console.log('No versions saved yet.');
  console.log('\nTo save current state:');
  console.log('  node versions/save.js <version-name>');
} else {
  versions.forEach(v => {
    const metaPath = path.join(VERSIONS_DIR, v, 'metadata.json');
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      console.log(`\n📌 ${v}`);
      console.log(`   Date: ${meta.date.split('T')[0]}`);
      console.log(`   Description: ${meta.description || 'N/A'}`);
    } else {
      console.log(`\n📌 ${v} (no metadata)`);
    }
  });
}

console.log('\n' + '─'.repeat(40));
console.log('\nCommands:');
console.log('  node versions/save.js <name>   - Save current state');
console.log('  node versions/restore.js <name> - Restore a version');
console.log('');