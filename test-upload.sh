curl -v localhost:4000/graphql \
  -F operations='{"query":"mutation UploadFile($file:Upload!) {uploadFile(file:$file)}", "variables":{"file":null}}'\
  -F map='{ "0": ["variables.file"] }' \
  -F 0=@/Users/hanjaenam/Archive/2021-plan/2_project/ec-server/stone.jpg