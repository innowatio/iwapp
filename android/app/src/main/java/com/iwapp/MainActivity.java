package com.iwapp;

import android.content.Intent;
import com.facebook.react.ReactActivity;
import com.oblador.vectoricons.VectorIconsPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    private ReactNativePushNotificationPackage mReactNativePushNotificationPackage;

    @Override
    protected String getJSBundleFile() {
        return CodePush.getBundleUrl();
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "iwapp";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        mReactNativePushNotificationPackage = new ReactNativePushNotificationPackage(this);
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new VectorIconsPackage(),
            mReactNativePushNotificationPackage,
            new CodePush("xTVrVoCtzZvbHdvVh3glBfPduf0wEJoFqD2lb", this, BuildConfig.DEBUG)
        );
    }

    // Add onNewIntent
    @Override
    protected void onNewIntent (Intent intent) {
        super.onNewIntent(intent);
        mReactNativePushNotificationPackage.newIntent(intent);
    }

}
