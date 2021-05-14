# curl -v localhost:4000/graphql \
#   -F operations='{"query":"mutation T($file:Upload!) {uploadFile(file:$file)}", "variables":{"file":null}}'\
#   -F map='{ "0": ["variables.file"] }' \
#   -F 0=@/Users/hanjaenam/Archive/2021-plan/2_project/ec-server/stone.jpg



curl -v -H "Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjIwODk2NTUxfQ.K1RfMoBxSTWdg6poGD_K--nxSByC_S4v5xo0ORgfpos" \
  -F operations='{"query":"mutation T($input:UpdateUserInput!) {updateUser(input:$input){ id }}", "variables":{ "input":{"thumbnail":null } }}'\
  -F map='{ "0": ["variables.input.thumbnail"] }' \
  -F 0=@/Users/hanjaenam/Archive/2021-plan/2_project/ec-server/stone.jpg \
  localhost:4000/graphql