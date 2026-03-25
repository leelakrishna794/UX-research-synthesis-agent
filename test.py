import requests
try:
    r = requests.post("http://localhost:8000/api/analyze", json={"url": "https://stripe.com"})
    print("STATUS:", r.status_code)
    print("RESPONSE:", r.json()["pain_points"][0])
except Exception as e:
    print("ERR", e)
