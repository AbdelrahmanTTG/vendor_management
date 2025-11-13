# import sys
# import requests

# url_http = "https://aqaratbenisuef.safehandapps.com/api/v1/realstate/getHomeData"
# token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODM4NzhkYjJlZDIyZDE5M2FmZDkwZDQiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MTgxNzI2N30.nFGGYVeIKJFqU-bKYfQJeT2a6hhVVtOSy8FoeZN_8Zo"

# headers = {
#     "Authorization": f"Bearer {token}"
# }

# print(" Testing HTTP request without redirect:")
# response_http = requests.get(url_http, allow_redirects=False)
# print("Status Code:", response_http.status_code)
# print("Headers:")
# for key, value in response_http.headers.items():
#     print(f"{key}: {value}")

# if response_http.status_code in [301, 302]:
#     redirect_url = response_http.headers.get('Location')
#     print(f"\n Redirect detected to: {redirect_url}")
# else:
#     print("\n No redirect occurred.")

# url_https = "https://aqaratbenisuef.safehandapps.com/api/v1/realstate/getHomeData"
# print("\n Sending authorized request to HTTPS URL...")
# response_https = requests.get(url_https, headers=headers)

# print("Status Code:", response_https.status_code)
# print("Response JSON:")

# import json
# print(json.dumps(response_https.json(), indent=2, ensure_ascii=False))
