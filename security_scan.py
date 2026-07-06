import os
import re

directory = r"c:\Users\jh404\OneDrive\Desktop\WEF website"

def scan_files():
    issues = []
    
    for root, dirs, files in os.walk(directory):
        if '.git' in root or 'node_modules' in root:
            continue
            
        for file in files:
            if file.endswith(('.html', '.js', '.css')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        
                    for i, line in enumerate(lines):
                        line_num = i + 1
                        
                        # Check for innerHTML
                        if 'innerHTML' in line:
                            issues.append(f"{file}:{line_num} - Found innerHTML: {line.strip()}")
                            
                        # Check for target="_blank" without rel="noopener noreferrer"
                        if 'target="_blank"' in line and 'noreferrer' not in line:
                            issues.append(f"{file}:{line_num} - target='_blank' without noreferrer: {line.strip()}")
                            
                        # Check for http://
                        if 'http://' in line:
                            issues.append(f"{file}:{line_num} - http:// used (non-HTTPS): {line.strip()}")
                            
                        # Check for dangerous JS
                        if re.search(r'(eval\(|document\.write\(|new Function\()', line):
                            issues.append(f"{file}:{line_num} - Dangerous JS function: {line.strip()}")
                            
                        # Check for hardcoded secrets
                        if re.search(r'(api_key|token|password|secret)\s*[:=]\s*["\'][a-zA-Z0-9_\-]+["\']', line, re.IGNORECASE):
                            issues.append(f"{file}:{line_num} - Possible hardcoded secret: {line.strip()}")
                            
                except Exception as e:
                    print(f"Could not read {file}: {e}")
                    
    return issues

issues = scan_files()
for issue in issues:
    print(issue)
