package br.com.apete.serra;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {
    private static final String SITE = "https://apete-serra.betaniaaa.workers.dev/";
    private WebView web;
    private LinearLayout errorPanel;
    private ProgressBar progress;

    @android.annotation.SuppressLint("SetJavaScriptEnabled") // Required by our HTTPS app; no native JS bridge or file access.
    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(Color.rgb(18,60,49));
        layout.setOnApplyWindowInsetsListener((view, insets) -> {
            view.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),
                insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());
            return insets.consumeSystemWindowInsets();
        });
        TextView title = new TextView(this);
        title.setText(R.string.app_title);
        title.setTextColor(Color.WHITE); title.setTextSize(18); title.setPadding(20,12,20,12);
        layout.addView(title);
        progress = new ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal);
        progress.setIndeterminate(true); layout.addView(progress,new LinearLayout.LayoutParams(-1,4));
        errorPanel = new LinearLayout(this); errorPanel.setOrientation(LinearLayout.VERTICAL);
        errorPanel.setPadding(32,48,32,32); errorPanel.setBackgroundColor(Color.WHITE);
        TextView notice = new TextView(this);
        notice.setText(R.string.connection_error);
        notice.setTextSize(18); errorPanel.addView(notice);
        Button retry = new Button(this); retry.setText(R.string.retry);
        retry.setOnClickListener(v -> {errorPanel.setVisibility(View.GONE); web.setVisibility(View.VISIBLE); web.loadUrl(SITE);});
        errorPanel.addView(retry);
        Button browser = new Button(this); browser.setText(R.string.open_browser);
        browser.setOnClickListener(v -> openExternal(Uri.parse(SITE))); errorPanel.addView(browser);
        errorPanel.setVisibility(View.GONE); layout.addView(errorPanel);
        web = new WebView(this);
        layout.addView(web,new LinearLayout.LayoutParams(-1,0,1)); setContentView(layout);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true); settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false); settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(false);
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request) {
                Uri uri=request.getUrl();
                if("https".equals(uri.getScheme()) && Uri.parse(SITE).getHost().equals(uri.getHost())) return false;
                if(request.isForMainFrame() && request.hasGesture()) openExternal(uri);
                return true;
            }
            @Override public void onPageStarted(WebView view,String url,android.graphics.Bitmap icon) {progress.setVisibility(View.VISIBLE);}
            @Override public void onPageFinished(WebView view,String url) {progress.setVisibility(View.GONE);}
            @Override public void onReceivedError(WebView view,WebResourceRequest request,WebResourceError error) {
                if(request.isForMainFrame()) {web.setVisibility(View.GONE);errorPanel.setVisibility(View.VISIBLE);progress.setVisibility(View.GONE);}
            }
        });
        if(android.os.Build.VERSION.SDK_INT>=33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,() -> {
                if(web.canGoBack()) web.goBack();else finish();
            });
        }
        if(saved==null || web.restoreState(saved)==null) web.loadUrl(SITE);
    }
    private void openExternal(Uri uri) {
        if(!java.util.Arrays.asList("https","mailto","tel","whatsapp").contains(uri.getScheme())) return;
        try {startActivity(new Intent(Intent.ACTION_VIEW,uri));}
        catch(ActivityNotFoundException ignored) {Toast.makeText(this,R.string.no_link_handler,Toast.LENGTH_LONG).show();}
    }
    @Override public void onBackPressed() {if(web.canGoBack()) web.goBack();else super.onBackPressed();}
    @Override protected void onSaveInstanceState(Bundle state) {web.saveState(state);super.onSaveInstanceState(state);}
    @Override protected void onDestroy() {web.destroy();super.onDestroy();}
}
