const fs = require('fs');

// curl https://registry.npmjs.org/swagger-ui-dist/latest > npm.json
// curl https://api.github.com/repos/ke4nec/swagger-ui-electron/releases/latest > github.json

// 检查是否跳过版本检查（手动触发时）
const SKIP_VERSION_CHECK = process.env.SKIP_VERSION_CHECK === 'true';

function compareVersions(v1, v2) {
  // 移除 'v' 前缀（如果有）
  const cleanV1 = v1.replace(/^v/, '');
  const cleanV2 = v2.replace(/^v/, '');
  
  const parts1 = cleanV1.split('.');
  const parts2 = cleanV2.split('.');
  
  const maxLength = Math.max(parts1.length, parts2.length);
  
  for (let i = 0; i < maxLength; i++) {
    const num1 = parseInt(parts1[i] || '0', 10);
    const num2 = parseInt(parts2[i] || '0', 10);
    
    if (isNaN(num1) || isNaN(num2)) {
      console.error('Invalid version format');
      return 0;
    }
    
    if (num1 < num2) return -1;
    if (num1 > num2) return 1;
  }
  
  return 0;
}

try {
  // 如果跳过版本检查，直接使用固定版本
  if (SKIP_VERSION_CHECK) {
    console.log('⚠ Skipping version check (manual trigger)');
    const TARGET_VERSION = '5.32.1';
    fs.writeFileSync('./ver.txt', TARGET_VERSION);
    console.log(`✓ Version ${TARGET_VERSION} written to ver.txt`);
    process.exit(0);
  }

  // 检查文件是否存在
  if (!fs.existsSync('./npm.json')) {
    console.error('Error: npm.json not found. Please run: curl https://registry.npmjs.org/swagger-ui-dist/latest > npm.json');
    process.exit(1);
  }
  
  if (!fs.existsSync('./github.json')) {
    console.error('Error: github.json not found. Please run: curl https://api.github.com/repos/ke4nec/swagger-ui-electron/releases/latest > github.json');
    process.exit(1);
  }
  
  const github = require('./github.json');
  const npm = require('./npm.json');
  
  console.log(`NPM version: ${npm.version}`);
  console.log(`GitHub tag: ${github.tag_name}`);
  
  // 比较版本
  const comparison = compareVersions(github.tag_name, npm.version);
  
  if (comparison < 0) {
    // GitHub 版本小于 NPM 版本，需要更新
    console.log('✓ Need update: Newer version available');
    try {
      fs.writeFileSync('./ver.txt', npm.version);
      console.log(`✓ Version ${npm.version} written to ver.txt`);
    } catch (err) {
      console.error('✗ Error writing ver.txt:', err.message);
      process.exit(1);
    }
    process.exit(0);
  } else if (comparison === 0) {
    // 版本相同
    console.log('✓ Versions are equal, no update needed');
    process.exit(1);
  } else {
    // GitHub 版本大于 NPM 版本（不应该发生）
    console.log('✓ GitHub version is newer, no update needed');
    process.exit(1);
  }
  
} catch (error) {
  console.error('✗ Error in sync.js:', error.message);
  process.exit(1);
}
