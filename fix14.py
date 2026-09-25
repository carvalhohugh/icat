import re
with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"]', content)
if match:
    imports = match.group(1)
    new_imports = imports
    for missing in ['Target', 'BarChart3']:
        if missing not in new_imports:
            new_imports += f', {missing}'
    
    if new_imports != imports:
        content = content.replace(imports, new_imports)

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
