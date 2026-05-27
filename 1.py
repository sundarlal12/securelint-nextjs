import boto3
import json

client = boto3.client(
    "bedrock-runtime",
    region_name="us-east-1"
)

response = client.invoke_model(
    modelId="arn:aws:bedrock:us-east-1:617318549193:application-inference-profile/4ocisc9t416h",
    body=json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 200,
        "messages": [
            {
                "role": "user",
                "content": "Hello"
            }
        ]
    }),
    contentType="application/json",
    accept="application/json"
)

print(response["body"].read())