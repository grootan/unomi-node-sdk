# Apache Unomi Nodejs Sdk

# Getting Stared

You can install the **Apache Unomi Node.js SDK** using **npm** or **yarn**:	

```bash
npm install --save unomi-node-sdk
```

```bash
yarn add unomi-node-sdk
```

# Connect to UnomiSdk
You can connect to **UnomiSdk** using the `connect` function:
```javascript
import unomisdk from "unomi-node-sdk";

const unomisdk = unomisdk.connect({
  url: "http://localhost:8181",
  auth: {
    username: "karaf",
    password: "karaf"
  },
  elasticUrl: "http://localhost:9200"
});

export default unomisdk;
```


# LICENSE
[Apache 2.0](/LICENSE.md)
