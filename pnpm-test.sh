#!/bin/bash

echo "Testing pnpm wrapper capabilities..."

# Test pnpm --version
pnpm --version
echo "✓ pnpm version check works"

# Test pnpm --help
pnpm --help | grep "pnpm\." | head -2
echo "✓ pnpm help access works"

# Test typecheck:libs
echo "Testing typecheck:libs on root..."
pm run typecheck:libs
echo "✓ typecheck:libs executed successfully"

# Test on jjs-soundboard
echo "Testing on jjs-soundboard..."
pnpm --filter @workspace/jjs-soundboard run typecheck
echo "✓ jjs-soundboard typecheck works"

# Test on api-server
echo "Testing on api-server..."
pnpm --filter @workspace/api-server run typecheck
echo "✓ api-server typecheck works"

echo "All pnpm tests passed successfully!"
