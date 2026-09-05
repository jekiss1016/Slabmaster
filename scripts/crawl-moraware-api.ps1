Add-Type -Path (Join-Path $PSScriptRoot "..\sdk_temp\bin\JobTrackerAPI5.dll")

$envFile = Join-Path $PSScriptRoot "..\.env.local"
if (-not (Test-Path $envFile)) {
    $envFile = Join-Path $PSScriptRoot "..\.env"
}

$user = ""
$pass = ""
$url = "https://ilgvegas-test2.moraware.net/api.aspx"

Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line.Split("=", 2)
        if ($parts.Length -eq 2) {
            $k = $parts[0].Trim()
            $v = $parts[1].Trim()
            if ($k -eq "MORAWARE_USER") { $user = $v }
            if ($k -eq "MORAWARE_PASS") { $pass = $v }
        }
    }
}

Write-Host "Authenticating with Moraware via Official API..." -ForegroundColor Cyan
Write-Host "Server URL: $url"
Write-Host "User: $user"

try {
    $conn = New-Object Moraware.JobTrackerAPI5.Connection($url, $user, $pass)
    $conn.Connect()
    Write-Host "SUCCESSFULLY CONNECTED!" -ForegroundColor Green

    $report = @{}
    $report["ServerUrl"] = $url
    $report["User"] = $user
    $report["Timestamp"] = (Get-Date).ToString("o")

    # 1. Inspect Processes
    Write-Host "Querying Processes..."
    try {
        $processes = $conn.GetProcesses()
        $report["Processes"] = @($processes | ForEach-Object {
            @{
                ProcessId = $_.ProcessId
                ProcessName = $_.ProcessName
                IsActive = $_.IsActive
            }
        })
        Write-Host "  Found $($processes.Count) Processes"
    } catch { Write-Host "  Could not query processes: $_" -ForegroundColor Yellow }

    # 2. Inspect Activity Types
    Write-Host "Querying Activity Types..."
    try {
        $actTypes = $conn.GetJobActivityTypes()
        $report["JobActivityTypes"] = @($actTypes | ForEach-Object {
            @{
                JobActivityTypeId = $_.JobActivityTypeId
                JobActivityTypeName = $_.JobActivityTypeName
                ProcessId = $_.ProcessId
                IsActive = $_.IsActive
                Color = $_.Color
            }
        })
        Write-Host "  Found $($actTypes.Count) Activity Types"
    } catch { Write-Host "  Could not query activity types: $_" -ForegroundColor Yellow }

    # 3. Inspect Custom Field Types
    Write-Host "Querying Custom Fields..."
    try {
        $jobCustom = $conn.GetJobCustomFieldTypes()
        $report["JobCustomFields"] = @($jobCustom | ForEach-Object {
            @{
                JobCustomFieldTypeId = $_.JobCustomFieldTypeId
                JobCustomFieldTypeName = $_.JobCustomFieldTypeName
                DataType = $_.DataType.ToString()
                IsActive = $_.IsActive
            }
        })
        Write-Host "  Found $($jobCustom.Count) Job Custom Fields"
    } catch { Write-Host "  Could not query job custom fields: $_" -ForegroundColor Yellow }

    # 4. Inspect Form Templates
    Write-Host "Querying Form Templates..."
    try {
        $forms = $conn.GetFormTemplates()
        $report["FormTemplates"] = @($forms | ForEach-Object {
            @{
                FormTemplateId = $_.FormTemplateId
                FormTemplateName = $_.FormTemplateName
                IsActive = $_.IsActive
            }
        })
        Write-Host "  Found $($forms.Count) Form Templates"
    } catch { Write-Host "  Could not query form templates: $_" -ForegroundColor Yellow }

    # 5. Inspect Views
    Write-Host "Querying Saved Views..."
    try {
        $jobViews = $conn.GetJobViews()
        $report["JobViews"] = @($jobViews | ForEach-Object {
            @{
                JobViewId = $_.JobViewId
                JobViewName = $_.JobViewName
            }
        })
        Write-Host "  Found $($jobViews.Count) Job Views"
    } catch { Write-Host "  Could not query job views: $_" -ForegroundColor Yellow }

    # 6. Sample Accounts and Jobs counts
    try {
        $accounts = $conn.GetAccounts()
        $report["AccountCount"] = $accounts.Count
        Write-Host "  Total Accounts: $($accounts.Count)"
    } catch { Write-Host "  Could not query accounts: $_" -ForegroundColor Yellow }

    $conn.Disconnect()

    $docsDir = Join-Path $PSScriptRoot "..\docs"
    if (-not (Test-Path $docsDir)) { New-Item -ItemType Directory -Path $docsDir }

    $jsonOut = Join-Path $docsDir "moraware_api_inventory.json"
    $report | ConvertTo-Json -Depth 5 | Set-Content -Path $jsonOut -Encoding UTF8
    Write-Host "API Inventory exported to: $jsonOut" -ForegroundColor Green
}
catch {
    Write-Host "Authentication failed: $($_.Exception.Message)" -ForegroundColor Red
}
