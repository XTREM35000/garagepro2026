#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const example = path.join(root, '.env.example')
const dest = path.join(root, '.env.local')

function main() {
  if (!fs.existsSync(example)) {
    console.warn('.env.example not found, skipping generation.')
    return
  }

  if (fs.existsSync(dest)) {
    console.log('.env.local already exists — leaving as-is')
    return
  }

  const content = fs.readFileSync(example, 'utf8')
  fs.writeFileSync(dest, content)
  console.log('Created .env.local from .env.example — please review and fill secrets')
}

main()
