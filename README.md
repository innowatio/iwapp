[![Build Status](https://travis-ci.org/innowatio/iwapp.svg?branch=master)](https://travis-ci.org/innowatio/iwapp)
[![Dependency Status](https://david-dm.org/innowatio/iwapp.svg)](https://david-dm.org/innowatio/iwapp)
[![devDependency Status](https://david-dm.org/innowatio/iwapp/dev-status.svg)](https://david-dm.org/innowatio/iwapp#info=devDependencies)

# iwapp

Mobile app of Innowatio.

## Development environment setup

After cloning the repository, run `npm install` to install all dependencies, and `npm run dev` to start the development server.

N.B. `iwapp` need backend service (iwwa-back) running on local 3000 port.

## Config

### android

There are three development configuration: `debug`, `beta` and `main`.

#### FCM

###### debug

In [`Firebase console`](https://console.firebase.google.com/), you can get the `google-services.json` file for package name `com.innowatio.iwapp.debug` and place it in `android/app/src/debug/` directory.

###### beta and main

In [`Firebase console`](https://console.firebase.google.com/), you can get the `google-services.json` file for package name `com.innowatio.iwapp` and place it in `android/app/` directory.

##### apk generation

Create a signing key with this command:

```sh
keytool -genkey -v -keystore iwapp-release.keystore -alias iwapp-release -keyalg RSA -keysize 2048 -validity 10000
```

This command prompts you for passwords for the keystore and key, and to provide the Distinguished Name fields for your key. It then generates the keystore as a file called my-release-key.keystore.

You should [set the signing key](https://github.com/innowatio/iwapp/blob/master/android/app/build.gradle#L92) in your `Keychain Access`, click the add button and insert `Keychain Item Name` as `iwapp-release` and `Account Name` as `Innowatio Spa`. For other info, see [React Native docs](https://facebook.github.io/react-native/docs/signed-apk-android.html) and [safer password in gradle post](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/).

#### iOS

All the modify to iOS code should be from `iwapp.xcworkspace` and NOT `iwapp.xcodeproj`:

```sh
open iwapp.xcworkspace
```

There are three development configuration: `Debug`, `Preprod` and `Release`.

##### FCM

In [`Firebase console`](https://console.firebase.google.com/), you can get the `GoogleService-Info.plist` file and place it in `/ios/iwapp` directory (next to your `Info.plist`).
