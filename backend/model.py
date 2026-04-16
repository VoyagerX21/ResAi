from pathlib import Path


class DummyEssayModel:
    def __init__(self, model_path: str):
        self.model_path = model_path

    def predict(self, essay: str) -> int:
        return len(essay)


def load_model(model_path: str) -> DummyEssayModel:
    path = Path(model_path)
    if not path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")

    return DummyEssayModel(model_path)