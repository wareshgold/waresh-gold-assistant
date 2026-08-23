# ==========================================
# Waresh Gold Assistant Snapshot Creator
# ==========================================

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

$snapshotName = "snapshot-$timestamp"

$snapshotDir = "docs/snapshots/$snapshotName"


Write-Host "Creating snapshot: $snapshotName"


# Create snapshot folder

New-Item -ItemType Directory -Force -Path $snapshotDir | Out-Null



# Current git information

git rev-parse HEAD |
Out-File "$snapshotDir/commit.txt"



git branch --show-current |
Out-File "$snapshotDir/branch.txt"



git status |
Out-File "$snapshotDir/status.txt"



git log -1 --stat |
Out-File "$snapshotDir/last-commit.txt"



# Project file inventory

git ls-tree -r --name-only HEAD |
Out-File "$snapshotDir/files.txt"



# Test result

Write-Host "Running tests..."

pnpm test |
Tee-Object -FilePath "$snapshotDir/tests.txt"



# Save package versions

pnpm list --depth=0 |
Out-File "$snapshotDir/dependencies.txt"



# Git add snapshot documentation

git add $snapshotDir



# Commit snapshot

git commit -m "snapshot: $snapshotName"



# Create git tag

git tag $snapshotName



# Push branch and tag

git push origin HEAD --tags



Write-Host ""
Write-Host "====================================="
Write-Host "Snapshot completed successfully"
Write-Host "Tag:"
Write-Host $snapshotName
Write-Host "====================================="