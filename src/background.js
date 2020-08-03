const DOH_TEST_DOMAIN = "doh.test";
const WHOARTTHOU_DOMAIN = "whoartthou";
const CANONICAL_DOMAIN = "firefox-resolver-usage-test.net";

async function resolveWithRetry(domain, flags) {
  let retryLimit = 3;
  let retryCount = 0;
  while (retryCount < retryLimit) {
    retryCount++;
    try {
      let { addresses, canonicalName } = await browser.dns.resolve(domain, flags);
      if (flags.includes("canonical_name")) {
        if (canonicalName) {
          return canonicalName;
        }
      } else if (addresses.length) {
        return addresses.join(",");
      }
    } catch (e) {
      if (e.message !== "NS_ERROR_UNKNOWN_HOST") {
        console.error(e);
      }
    }
  }
  return "";
} 

async function main() {
  await browser.telemetry.registerEvents("doh.study.resolverusage", {
    resolve: {
      methods: ["resolve"],
      objects: ["domains"],
      extra_keys: ["dohtest", "whoartthou", "canonical", "uuid"],
      record_on_release: true,
    },
  });

  let flags = [
    "bypass_cache",
    "disable_ipv6",
    "disable_trr",
  ];

  let whoartthouResults = await resolveWithRetry(WHOARTTHOU_DOMAIN, flags);

  let uuid = await browser.uuid.get();
  let uniqueCanonicalDomain = `${uuid}.${CANONICAL_DOMAIN}`;
  let canonicalResults = await resolveWithRetry(uniqueCanonicalDomain, flags);

  flags.push("canonical_name");
  let dohtestResults = await resolveWithRetry(DOH_TEST_DOMAIN, flags);

  await browser.telemetry.recordEvent(
    "doh.study.resolverusage",
    "resolve",
    "domains",
    "ok",
    {
      "dohtest": dohtestResults.substring(0, 80),       // Max length is 80 chars
      "whoartthou": whoartthouResults.substring(0, 80), // so truncate foreign
      "canonical": canonicalResults.substring(0, 80),   // data before sending
      uuid
    }
  );

  await browser.management.uninstallSelf();
}

main();
