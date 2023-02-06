import AgoraRTC from "agora-rtc-react";
import { useMemo, useState } from "react";
import { useEffect } from "react";

const styles = {
  deviceListContainer: {
    flex: 1,
    textAlign: "center",
  },
};

const BrowserDeviceButton = ({ device, onClick }) => {
  return (
    <button style={{ width: "100%" }} onClick={onClick}>
      {JSON.stringify(device, null, 2)}
    </button>
  );
};

const BrowserDevices = ({ client, tracks }) => {
  const [deviceList, setDeviceList] = useState([]);
  const [mics, speaks, cams] = useMemo(() => {
    return [
      deviceList.filter((e) => e.kind === "audioinput"),
      deviceList.filter((e) => e.kind === "audiooutput"),
      deviceList.filter((e) => e.kind === "videoinput"),
    ];
  }, [deviceList]);

  const generalCallback = (device) => {
    console.log("[DEVICE SEL BROWSER]: New device detected", device);
    setDeviceList((dl) => [
      device.device,
      ...dl.filter((e) => e.deviceId !== device.device.deviceId),
    ]);
  };

  useEffect(() => {
    (async () => {
      try {
        const browserDevices = await navigator.mediaDevices.enumerateDevices();
        console.log("[DEVICE SEL BROWSER]: Got devices", browserDevices);
        setDeviceList(browserDevices);
        addEventListener("devicechange", generalCallback);
      } catch (e) {
        console.error("[DEVICE SEL BROWSER]: Error Getting devices", e);
      }
    })();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <h1>Brwsr Devices</h1>
      <div style={styles.deviceListContainer}>
        <h3>Audio Input Devices</h3>
        <div>
          {mics.map((e) => (
            <BrowserDeviceButton
              device={e}
              onClick={() => {
                console.log("[DEVICE SEL]: Selecting", e);
                tracks[0].setDevice(e.deviceId);
              }}
            />
          ))}
        </div>
      </div>
      <div style={styles.deviceListContainer}>
        <h3>Audio Output Devices</h3>
        <div>
          {speaks.map((e) => (
            <BrowserDeviceButton
              device={e}
              onClick={() => {
                console.log("[DEVICE SEL BROWSER]: Selecting", e);
                client.remoteUsers?.forEach((user) => {
                  user.audioTrack?.setPlaybackDevice(e.deviceId);
                });
              }}
            />
          ))}
        </div>
      </div>
      <div style={styles.deviceListContainer}>
        <h3>Video Input Devices</h3>
        <div>
          {cams.map((e) => (
            <BrowserDeviceButton
              device={e}
              onClick={() => {
                console.log("[DEVICE SEL BROWSER]: Selecting", e);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowserDevices;
