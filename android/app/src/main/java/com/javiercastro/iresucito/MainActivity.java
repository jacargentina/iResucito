package com.javiercastro.iresucito;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.zoontek.rnbootsplash.RNBootSplash;

public class MainActivity extends ReactActivity {

     @Override
     protected ReactActivityDelegate createReactActivityDelegate() {
       return new ReactActivityDelegate(this, getMainComponentName()) {
    
         @Override
         protected void loadApp(String appKey) {
           RNBootSplash.init(MainActivity.this);
           super.loadApp(appKey);
         }
       };
     }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "iResucito";
    }
}
