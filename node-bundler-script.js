const path = require('path');
const fs = require('fs').promises;

async function generateBundle() {
  try {
    const folder = path.resolve('dist/browser/');
    let content = `import "${path.join(folder, 'polyfills.js')}";\n`;
    
    const files = await fs.readdir(folder);
    for (const file of files) {
      if (file.endsWith('.js') && file !== 'polyfills.js') {
        content += `import "${path.join(folder, file)}";\n`;
      }
    }
    
    await fs.writeFile(path.join(folder, 'bundle.ts'), content);
    console.log('bundle.ts file written successfully');
    
    // Optional: Execute esbuild command
    const { exec } = require('child_process');
    exec('esbuild dist/browser/bundle.ts --bundle --minify --outdir=dist/browser', (error, stdout, stderr) => {
      if (error) {
        console.error(`esbuild error: ${error.message}`);
        return;
      }
      if (stderr) console.error(stderr);
      console.log(stdout || 'bundle.js created successfully with esbuild');
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Execute the function
generateBundle();
