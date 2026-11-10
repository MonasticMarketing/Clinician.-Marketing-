import Script from "next/script";

/**
 * GA4 / Google Tag Manager loader.
 *
 * Nothing renders unless an ID is supplied through the environment — no
 * measurement ID is ever hardcoded. Set one of:
 *   NEXT_PUBLIC_GA_ID   e.g. G-XXXXXXXXXX
 *   NEXT_PUBLIC_GTM_ID  e.g. GTM-XXXXXXX
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  if (!gaId && !gtmId) return null;

  return (
    <>
      {gtmId ? (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>

          {/* GTM's standard fallback for visitors without JavaScript.
              Hidden from assistive technology: it renders nothing and an
              unlabelled frame is otherwise announced as a landmark. */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
              aria-hidden="true"
              tabIndex={-1}
            />
          </noscript>
        </>
      ) : null}

      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
