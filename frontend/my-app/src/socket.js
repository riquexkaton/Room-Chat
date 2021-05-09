import io from "socket.io-client";

let socket= io('http://localhost:4000', {
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });

export default socket;