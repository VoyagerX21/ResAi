from pathlib import Path

from flask import Flask, jsonify, request

from model import load_model


app = Flask(__name__)
BASE_DIR = Path(__file__).resolve().parent
model = load_model(BASE_DIR / "model.safetensor")


@app.get("/healthCheck")
def health_check():
    return jsonify(status="ok")


@app.post("/submit")
def submit():
    payload = request.get_json(silent=True)
    essay = None

    if isinstance(payload, dict):
        essay = payload.get("essay")
    elif isinstance(payload, str):
        essay = payload

    if essay is None and not request.is_json:
        essay = request.get_data(as_text=True)

    if not isinstance(essay, str):
        return jsonify(error="essay must be a string"), 400

    essay = essay.strip()
    if not essay:
        return jsonify(error="essay is required"), 400

    print(essay)
    prediction = model.predict(essay)
    print(f"model.predict output: {prediction}")

    return jsonify(
        message="Essay received",
        prediction=prediction,
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)