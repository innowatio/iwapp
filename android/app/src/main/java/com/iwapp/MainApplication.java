package com.innowatio.iwapp;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.microsoft.codepush.react.CodePush;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private Application mApplication = this;

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new ImagePickerPackage(),
            new VectorIconsPackage(),
            new CodePush(getString(R.string.reactNativeCodePush_androidDeploymentKey), mApplication, BuildConfig.DEBUG),
            new ReactNativePushNotificationPackage(mApplication)
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
