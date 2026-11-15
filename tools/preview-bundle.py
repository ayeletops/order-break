"""Make self-contained preview copies of the pages (CSS/JS inlined) for local viewing panels that can't load linked files."""
import re, pathlib, shutil, sys
root = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
for page in ['index.html', 'roi.html', 'work.html', 'horizon.html']:
    h = (root/page).read_text()
    h = re.sub(r'<link rel="stylesheet" href="([^"]+)">', lambda m: f'<style>{(root/m.group(1)).read_text()}</style>', h)
    h = re.sub(r'<script src="([^"]+)"></script>', lambda m: f'<script>{(root/m.group(1)).read_text()}</script>', h)
    (out/page).write_text(h)
shutil.copytree(root/'assets', out/'assets', dirs_exist_ok=True)
print('ok')
