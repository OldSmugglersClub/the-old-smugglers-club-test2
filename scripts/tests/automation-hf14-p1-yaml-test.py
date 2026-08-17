from pathlib import Path
import yaml

root = Path(__file__).resolve().parents[2]
files = [
    root / ".github/workflows/dynamo-terminimport-auto.yml",
    root / ".github/workflows/bundesliga-terminimport-auto.yml",
]
for path in files:
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    assert isinstance(data, dict)
    text = path.read_text(encoding="utf-8")
    assert "node scripts/schedule-terminstand.mjs" in text
    assert "git diff --quiet -- spieldaten.json schedule-terminstand.json" in text
    assert "git add spieldaten.json schedule-terminstand.json" in text
print("HF14_P1_YAML_OK")
