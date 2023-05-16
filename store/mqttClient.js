import { createContext, useEffect, useState } from "react";
import Paho from "paho-mqtt";
export const ClinetMQTT = createContext({
  client: new Paho.Client("reflow.online", Number(9001), "/", "ws"),
  isconnected: false,
});

function MqttClientProvider({ children }) {
  const [isconnected, setisconnected] = useState(false);
  var client = new Paho.Client("reflow.online", Number(9001), "/", "ws");
  //   var client = new Paho.Client("reflow.online", Number(9001), "/", "ws");

  useEffect(() => {
    async function conn() {
      client = new Paho.Client("reflow.online", Number(9001), "/", "ws");
      await client.connect({
        onSuccess: function () {
          console.log("connecteddevicecont");
          // client.subscribe("led");
          setisconnected(true);
          setagainconnect(true);
          //     let message = new Paho.Message("Hello World!");
          // message.destinationName = "my/topic";
          // client.send(message);
        },
        userName: "nuclear",
        password: "netquantity",
        useSSL: false,
        onFailure: function () {
          console.log("not connected");
        },
      });
    }
    conn();
    return () => {
      // console.log("This will be logged on unmount");
    };
  });

  if (isconnected) {
    const value = {
      client: client,
      isconnected: isconnected,
    };
    return <ClinetMQTT.Provider value={value}>{children}</ClinetMQTT.Provider>;
  }
}

export default MqttClientProvider;
