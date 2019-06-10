const Peer = require("simple-peer");
const WRTC = require("wrtc");
const util = require("util");

let peer1 = new Peer({ initiator: true, wrtc: WRTC });
let peer2 = new Peer({ wrtc: WRTC });

peer1.on("signal", data => {
  // when peer1 has signaling data, give it to peer2
  peer2.signal(data);
});

peer2.on("signal", data => {
  // when peer2 has signaling data, give it to peer1
  peer1.signal(data);
});

const MESSAGE = "this is a test message";

peer1.on("connect", () => {
  // wait for 'connect' event before using the data channel
  console.log("peer 1 connected");
  peer1.send(MESSAGE);
});

peer2.on("data", data => {
  // got a data channel message
  console.log("peer 2 got a message from peer 1: [" + data + "]");
  if (data.toString("utf8") === MESSAGE) {
    console.log("Tests pass");
    process.exit(0);
  } else {
    console.log(util.inspect(data, false, null, true));
    console.log("FAIL");
    process.exit(1);
  }
});
