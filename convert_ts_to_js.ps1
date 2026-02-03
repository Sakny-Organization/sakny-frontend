# TypeScript to JavaScript Converter Script
# This script converts TypeScript files to JavaScript by:
# 1. Renaming .ts/.tsx files to .js/.jsx
# 2. Removing TypeScript-specific syntax

$projectRoot = "c:\Users\pc\Desktop\route\front\frontend developer\sakny"

# Function to convert a single file
function Convert-TSFile {
    param (
        [string]$filePath
    )
    
    Write-Host "Converting: $filePath"
    
    # Read file content
    $content = Get-Content $filePath -Raw
    
    # Remove type annotations and interfaces
    # Remove React.FC<Props>
    $content = $content -replace 'React\.FC<[^>]+>', ''
    $content = $content -replace 'React\.FC', ''
    
    # Remove type imports
    $content = $content -replace "import\s+{\s*([^}]+)\s*}\s+from\s+'\.\.?/types';\s*", ''
    $content = $content -replace "import\s+type\s+{[^}]+}\s+from\s+'[^']+';\s*", ''
    
    # Remove interface declarations
    $content = $content -replace "(?ms)interface\s+\w+\s*{[^}]*}\s*", ''
    $content = $content -replace "(?ms)export\s+interface\s+\w+\s*{[^}]*}\s*", ''
    
    # Remove type annotations from parameters
    $content = $content -replace ':\s*React\.\w+<[^>]+>', ''
    $content = $content -replace ':\s*React\.\w+', ''
    $content = $content -replace ':\s*string\b', ''
    $content = $content -replace ':\s*number\b', ''
    $content = $content -replace ':\s*boolean\b', ''
    $content = $content -replace ':\s*any\b', ''
    $content = $content -replace ':\s*void\b', ''
    
    # Remove generic types
    $content = $content -replace '<[A-Z]\w+(\[\])?\s*>', ''
    
    # Remove RootState type
    $content = $content -replace "import\s+{\s*RootState\s*}\s+from\s+'[^']+';\s*", ''
    $content = $content -replace ':\s*RootState', ''
    
    # Remove PayloadAction
    $content = $content -replace ',\s*PayloadAction', ''
    
    # Determine new extension
    $newExtension = if ($filePath -match '\.tsx$') { '.jsx' } else { '.js' }
    $newPath = $filePath -replace '\.(ts|tsx)$', $newExtension
    
    # Write converted content
    Set-Content -Path $newPath -Value $content
    
    Write-Host "Created: $newPath"
}

# Get all TypeScript files (excluding node_modules)
$tsFiles = Get-ChildItem -Path $projectRoot -Recurse -Include *.ts,*.tsx -Exclude *.d.ts | 
    Where-Object { $_.FullName -notmatch 'node_modules' }

Write-Host "Found $($tsFiles.Count) TypeScript files to convert"

foreach ($file in $tsFiles) {
    Convert-TSFile -filePath $file.FullName
}

Write-Host "`nConversion complete!"
Write-Host "Note: This script creates new .js/.jsx files. Original .ts/.tsx files are not deleted."
Write-Host "You should manually review the converted files and delete the originals after verification."
