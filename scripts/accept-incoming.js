// Script: accept-incoming.js
// Usage: node accept-incoming.js [rootPath]
// Replaces git conflict blocks (<<<<<<< HEAD ... ======= ... >>>>>>>) with the incoming/theirs section

const fs = require('fs').promises;
const path = require('path');

const rootArg = process.argv[2] || process.cwd();
const ignoredNames = new Set(['node_modules', '.git', '.venv', 'venv', 'dist', 'build']);

async function walk(dir, fileList = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    return fileList; // permission or other error
  }

  for (const ent of entries) {
    if (ignoredNames.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      await walk(full, fileList);
    } else if (ent.isFile()) {
      fileList.push(full);
    }
  }
  return fileList;
}

async function processFile(file) {
  try {
    let content = await fs.readFile(file, 'utf8');
    if (!content.includes('<<<<<<<')) return false;

    const backup = file + '.merge-backup';
    await fs.writeFile(backup, content, 'utf8');

    let changed = false;
    while (true) {
      const startIdx = content.indexOf('<<<<<<<');
      if (startIdx === -1) break;
      const sepIdx = content.indexOf('=======', startIdx);
      const endIdx = content.indexOf('>>>>>>>', sepIdx);
      if (sepIdx === -1 || endIdx === -1) {
        console.error('Found malformed conflict block in', file);
        break;
      }

      const incoming = content.slice(sepIdx + '======='.length, endIdx);
      const trimmedIncoming = incoming.replace(/^\r?\n+/, '').replace(/\r?\n+$/, '');

      const prefix = content.slice(0, startIdx);
      const suffix = content.slice(endIdx + '>>>>>>>'.length);

      // ensure single newline after incoming content when replacing
      const replacement = trimmedIncoming === '' ? '' : trimmedIncoming + '\n';

      content = prefix + replacement + suffix;
      changed = true;
    }

    if (changed) {
      await fs.writeFile(file, content, 'utf8');
      console.log('Fixed:', file);
      return true;
    }

    return false;
  } catch (err) {
    console.error('Error processing', file, err && err.message ? err.message : err);
    return false;
  }
}

(async () => {
  const root = path.isAbsolute(rootArg) ? rootArg : path.join(process.cwd(), rootArg);
  console.log('Scanning for conflict markers under', root);
  const allFiles = await walk(root);
  const changed = [];
  for (const f of allFiles) {
    const ok = await processFile(f);
    if (ok) changed.push(f);
  }
  console.log('\nDone. Files changed:', changed.length);
  if (changed.length) console.log(changed.join('\n'));
})();
// Script: accept-incoming.js
// Usage: node accept-incoming.js [rootPath]
// Replaces git conflict blocks (<<<<<<< HEAD ... ======= ... >>>>>>>) with the incoming/theirs section

const fs = require('fs').promises;
const path = require('path');

const rootArg = process.argv[2] || process.cwd();
const ignoredNames = new Set(['node_modules', '.git', '.venv', 'venv', 'dist', 'build']);

async function walk(dir, fileList = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    return fileList; // permission or other error
  }

  for (const ent of entries) {
    if (ignoredNames.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      await walk(full, fileList);
    } else if (ent.isFile()) {
      fileList.push(full);
    }
  }
  return fileList;
}

async function processFile(file) {
  try {
    let content = await fs.readFile(file, 'utf8');
    if (!content.includes('<<<<<<<')) return false;

    const backup = file + '.merge-backup';
    await fs.writeFile(backup, content, 'utf8');

    let changed = false;
    while (true) {
      const startIdx = content.indexOf('<<<<<<<');
      if (startIdx === -1) break;
      const sepIdx = content.indexOf('=======', startIdx);
      const endIdx = content.indexOf('>>>>>>>', sepIdx);
      if (sepIdx === -1 || endIdx === -1) {
        console.error('Found malformed conflict block in', file);
        break;
      }

      const incoming = content.slice(sepIdx + '======='.length, endIdx);
      const trimmedIncoming = incoming.replace(/^\r?\n+/, '').replace(/\r?\n+$/, '');

      const prefix = content.slice(0, startIdx);
      const suffix = content.slice(endIdx + '>>>>>>>'.length);

      // ensure single newline after incoming content when replacing
      const replacement = trimmedIncoming === '' ? '' : trimmedIncoming + '\n';

      content = prefix + replacement + suffix;
      changed = true;
    }

    if (changed) {
      await fs.writeFile(file, content, 'utf8');
      console.log('Fixed:', file);
      return true;
    }

    return false;
  } catch (err) {
    console.error('Error processing', file, err && err.message ? err.message : err);
    return false;
  }
}

(async () => {
  const root = path.isAbsolute(rootArg) ? rootArg : path.join(process.cwd(), rootArg);
  console.log('Scanning for conflict markers under', root);
  const allFiles = await walk(root);
  const changed = [];
  for (const f of allFiles) {
    const ok = await processFile(f);
    if (ok) changed.push(f);
  }
  console.log('\nDone. Files changed:', changed.length);
  if (changed.length) console.log(changed.join('\n'));
})();
// Script: accept-incoming.js
// Usage: node accept-incoming.js [rootPath]
// Replaces git conflict blocks ( ... 

// Script: accept-incoming.js
// Usage: node accept-incoming.js [rootPath]
// Replaces git conflict blocks (<<<<<<< HEAD ... ======= ... >>>>>>>) with the incoming/theirs section

const fs = require('fs').promises;
const path = require('path');

const root = process.argv[2] || process.cwd();
const ignoredNames = new Set(['node_modules', '.git', '.venv', 'venv', 'dist', 'build']);

async function walk(dir, fileList = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    return fileList; // permission or other error
  }

  for (const ent of entries) {
    if (ignoredNames.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      await walk(full, fileList);
    } else if (ent.isFile()) {
      fileList.push(full);
    }
  }
  return fileList;
}

// Robustly replace conflict blocks with incoming (theirs) section using index scanning.
async function processFile(file) {
  try {
    let content = await fs.readFile(file, 'utf8');
    if (!content.includes('<<<<<<<')) return false;

    const backup = file + '.merge-backup';
    await fs.writeFile(backup, content, 'utf8');

    let changed = false;
    while (true) {
      const startIdx = content.indexOf('<<<<<<<');
      if (startIdx === -1) break;
      const sepIdx = content.indexOf('=======', startIdx);
      // Script: accept-incoming.js
      // Usage: node accept-incoming.js [rootPath]
      // Replaces git conflict blocks (<<<<<<< HEAD ... ======= ... >>>>>>>) with the incoming/theirs section

      const fs = require('fs').promises;
      const path = require('path');

      const root = process.argv[2] || process.cwd();
      const ignoredNames = new Set(['node_modules', '.git', '.venv', 'venv', 'dist', 'build']);

      async function walk(dir, fileList = []) {
        let entries;
        try {
          entries = await fs.readdir(dir, { withFileTypes: true });
        } catch (err) {
          return fileList; // permission or other error
        }

        for (const ent of entries) {
          if (ignoredNames.has(ent.name)) continue;
          const full = path.join(dir, ent.name);
          if (ent.isDirectory()) {
            await walk(full, fileList);
          } else if (ent.isFile()) {
            fileList.push(full);
          }
        }
        return fileList;
      }

      // Robustly replace conflict blocks with incoming (theirs) section using index scanning.
      async function processFile(file) {
        try {
          let content = await fs.readFile(file, 'utf8');
          if (!content.includes('<<<<<<<')) return false;

          const backup = file + '.merge-backup';
          await fs.writeFile(backup, content, 'utf8');

          let changed = false;
          while (true) {
            const startIdx = content.indexOf('<<<<<<<');
            if (startIdx === -1) break;
            const sepIdx = content.indexOf('=======', startIdx);
            // Script: accept-incoming.js
            // Usage: node accept-incoming.js [rootPath]
            // Replaces git conflict blocks (<<<<<<< HEAD ... ======= ... >>>>>>>) with the incoming/theirs section

            const fs = require('fs').promises;
            const path = require('path');

            const rootArg = process.argv[2] || process.cwd();
            const ignoredNames = new Set(['node_modules', '.git', '.venv', 'venv', 'dist', 'build']);

            async function walk(dir, fileList = []) {
              let entries;
              try {
                entries = await fs.readdir(dir, { withFileTypes: true });
              } catch (err) {
                return fileList; // permission or other error
              }

              for (const ent of entries) {
                if (ignoredNames.has(ent.name)) continue;
                const full = path.join(dir, ent.name);
                if (ent.isDirectory()) {
                  await walk(full, fileList);
                } else if (ent.isFile()) {
                  fileList.push(full);
                }
              }
              return fileList;
            }

            async function processFile(file) {
              try {
                let content = await fs.readFile(file, 'utf8');
                if (!content.includes('<<<<<<<')) return false;

                const backup = file + '.merge-backup';
                await fs.writeFile(backup, content, 'utf8');

                let changed = false;
                while (true) {
                  const startIdx = content.indexOf('<<<<<<<');
                  if (startIdx === -1) break;
                  const sepIdx = content.indexOf('=======', startIdx);
                  const endIdx = content.indexOf('>>>>>>>', sepIdx);
                  if (sepIdx === -1 || endIdx === -1) {
                    console.error('Found malformed conflict block in', file);
                    break;
                  }

                  const incoming = content.slice(sepIdx + '======='.length, endIdx);
                  const trimmedIncoming = incoming.replace(/^\r?\n+/, '').replace(/\r?\n+$/, '');

                  const prefix = content.slice(0, startIdx);
                  const suffix = content.slice(endIdx + '>>>>>>>'.length);

                  // ensure single newline after incoming content when replacing
                  const replacement = trimmedIncoming === '' ? '' : trimmedIncoming + '\n';

                  content = prefix + replacement + suffix;
                  changed = true;
                }

                if (changed) {
                  await fs.writeFile(file, content, 'utf8');
                  console.log('Fixed:', file);
                  return true;
                }

                return false;
              } catch (err) {
                console.error('Error processing', file, err && err.message ? err.message : err);
                return false;
              }
            }

            (async () => {
              const root = path.isAbsolute(rootArg) ? rootArg : path.join(process.cwd(), rootArg);
              console.log('Scanning for conflict markers under', root);
              const allFiles = await walk(root);
              const changed = [];
              for (const f of allFiles) {
                const ok = await processFile(f);
                if (ok) changed.push(f);
              }
              console.log('\nDone. Files changed:', changed.length);
              if (changed.length) console.log(changed.join('\n'));
            })();
