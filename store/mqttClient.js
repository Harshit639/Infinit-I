import { createContext } from "react";
import Paho from "paho-mqtt";
export const ClinetMQTT = createContext({
  client: new Paho.Client("reflow.online", Number(9001), "/", "ws"),
  connectclient: () => {},
});

function MqttClientProvider({ children }) {
  var client = new Paho.Client("reflow.online", Number(9001), "/", "ws");
  async function connectclient() {
    client = new Paho.Client("reflow.online", Number(9001), "/", "ws");
    await client.connect({
      onSuccess: function () {
        console.log("connecteddevicefromcontext");
        // client.subscribe("led");
        setconnected(true);
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

  const value = {
    client: client,
    connectclient: connectclient,
  };
  return <ClinetMQTT.Provider value={value}>{children}</ClinetMQTT.Provider>;
}

export default MqttClientProvider;
