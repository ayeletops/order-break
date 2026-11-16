"""Cache-bust: stamp every local css/js link in the pages with ?v=<timestamp>, so a push always loads fresh files.
Run before committing: python3 tools/stamp.py"""
import re, time, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
v = time.strftime('%Y%m%d%H%M')
for page in ['index.html', 'roi.html', 'work.html', 'horizon.html', 'process.html']:
    p = root / page; h = p.read_text()
    h = re.sub(r'((?:href|src)="(?:css|js)/[^"?]+\.(?:css|js))(\?v=\d+)?"', rf'\1?v={v}"', h)
    p.write_text(h)
print('stamped', v)
