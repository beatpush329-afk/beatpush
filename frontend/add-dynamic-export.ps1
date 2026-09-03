# PowerShell script to add 'export const dynamic = "force-dynamic"' to all page.tsx files

$pageFiles = Get-ChildItem -Path "src/app" -Recurse -Filter "page.tsx"

foreach ($file in $pageFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if already has dynamic export
    if ($content -notmatch 'export const dynamic') {
        Write-Host "Processing: $($file.FullName)"
        
        # Add dynamic export after imports
        $lines = $content -split "`n"
        $insertIndex = -1
        
        for ($i = 0; $i -lt $lines.Count; $i++) {
            $line = $lines[$i].Trim()
            # Find first non-import, non-comment, non-empty line
            if ($line -ne '' -and 
                -not $line.StartsWith('import ') -and 
                -not $line.StartsWith('//') -and 
                -not $line.StartsWith('/*') -and 
                -not $line.StartsWith('*') -and 
                -not $line.StartsWith('*/') -and
                -not $line.StartsWith('"use client"') -and
                -not $line.StartsWith("'use client'")) {
                $insertIndex = $i
                break
            }
        }
        
        if ($insertIndex -ge 0) {
            # Insert the dynamic export
            $newLines = $lines[0..($insertIndex-1)] + '' + 'export const dynamic = "force-dynamic";' + '' + $lines[$insertIndex..($lines.Count-1)]
            $newContent = $newLines -join "`n"
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "Added dynamic export to: $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "Could not find insertion point for: $($file.Name)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Already has dynamic export: $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host "All page files processed!" -ForegroundColor Green
