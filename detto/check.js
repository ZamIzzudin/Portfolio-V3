/**
 * Quick sanity check that all portfolio components have valid syntax.
 * Run with: node check.js
 */

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const componentFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

console.log('Checking portfolio component syntax...\n');

let passed = 0;
let failed = 0;

for (const file of componentFiles) {
  const filePath = path.join(componentsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  try {
    // Only InteractiveCalendar uses clsx for simple utility
    let requiredChecks = [
      { name: 'export default', pattern: /export\s+default\s+function/ },
      { name: '"use client"', pattern: /"use client"/ },
      { name: 'framer-motion import', pattern: /from\s+['"]framer-motion['"]/ },
      { name: 'lucide-react import', pattern: /from\s+['"]lucide-react['"]/ },
    ];

    // Only InteractiveCalendar actually uses clsx
    if (file === 'InteractiveCalendar.tsx') {
      requiredChecks.push({ name: 'clsx import', pattern: /import.*clsx/ });
    }

    const fileErrors = requiredChecks.filter(c => !c.pattern.test(content));

    if (fileErrors.length > 0) {
      console.log(`❌ ${file}: Missing ${fileErrors.map(c => c.name).join(', ')}`);
      failed++;
    } else {
      console.log(`✅ ${file}: All required imports present`);
      passed++;
    }
  } catch (err) {
    console.log(`❌ ${file}: Read error - ${err.message}`);
    failed++;
  }
}

console.log(`\n=== Results ===`);
console.log(`Passed: ${passed}/${componentFiles.length}`);
console.log(`Failed: ${failed}/${componentFiles.length}`);

process.exit(failed > 0 ? 1 : 0);
