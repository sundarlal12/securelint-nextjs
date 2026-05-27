import requests

# Exact raw bytes
payload = bytes.fromhex(
    "3b0a2a68747470733a2f2f377968337965792e746f702f64756a72336461392f7031454572772f42703432687810011a09120208021a0308920120"
)

headers = {
    "Content-Type": "application/octet-stream",
    "Accept": "*/*",
    "User-Agent": "Mozilla/5.0"
}

url = "https://urlite.ff.avast.com/v1/urlinfo"

r = requests.post(url, headers=headers, data=payload)

print("Status:", r.status_code)
print(r.text)
