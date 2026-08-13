#!/usr/bin/env node
import { execSync } from 'child_process'

function run(cmd) {
  console.log('> ' + cmd)
  execSync(cmd, { stdio: 'inherit', shell: true })
}

try {
  run('npm run build')

  // Check if there are changes in docs
  const status = execSync('git status --porcelain docs', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'], shell: true })
  if (!status.trim()) {
    console.log('No hay cambios en /docs para commitear.')
  } else {
    run('git add docs')
    try {
      run('git commit -m "chore(deploy): update docs"')
    } catch (e) {
      console.log('No se creó commit (posiblemente sin cambios).')
    }
    run('git push origin HEAD:main')
  }

  console.log('Deploy script finalizado.')
} catch (err) {
  console.error(err)
  process.exit(1)
}
