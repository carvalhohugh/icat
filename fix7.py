import re
with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'<div>\s*<label className="block text-sm font-medium text-gray-700 mb-1">Formato</label>.*?</div>',
    '', content, flags=re.DOTALL
)

content = re.sub(
    r'<div>\s*<label className="flex items-center gap-3 cursor-pointer">\s*<div onClick=\{.*?\bnovaPesquisa\.multiSelect\b.*?</label>\s*</div>',
    '', content, flags=re.DOTALL
)

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
