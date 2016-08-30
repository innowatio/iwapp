import DeviceInfo from "react-native-device-info";

export default function getDeviceInfo () {
    return {
        uuid: DeviceInfo.getUniqueID(),
        model: DeviceInfo.getModel(),
        platform: DeviceInfo.getSystemName(),
        version: DeviceInfo.getSystemVersion(),
        appVersion: DeviceInfo.getVersion(),
        bundle: DeviceInfo.getBundleId(),
        userAgent: DeviceInfo.getUserAgent()
    };
}
