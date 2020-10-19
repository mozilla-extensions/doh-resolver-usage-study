const DOH_TEST_DOMAIN = "doh.test";
const DOH_TEST_DOT_DOMAIN = "doh.test.";
const WHOARTTHOU_DOMAIN = "whoartthou.";
const CANONICAL_DOMAIN = "firefox-resolver-usage-test.net.";

// From https://stackoverflow.com/a/2117523
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

async function resolveWithRetry(domainGetter, flags) {
  let retryLimit = 3;
  let retryCount = 0;
  while (retryCount < retryLimit) {
    retryCount++;
    try {
      let domain = typeof domainGetter == "function"
        ? domainGetter(retryCount)
        : domainGetter;
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
      extra_keys: ["dohtest", "dohtestdot", "whoartthou", "canonical", "uuid", "uuidRetries"],
      record_on_release: true,
    },
  });

  let flags = [
    "bypass_cache",
    "disable_ipv6",
    "disable_trr",
  ];

  let whoartthouResults = await resolveWithRetry(WHOARTTHOU_DOMAIN, flags);

  let uuid = uuidv4();
  let uniqueCanonicalDomain = `${uuid}.${CANONICAL_DOMAIN}`;
  let uniqueDomainRetryCount = 0;
  let canonicalResults = await resolveWithRetry(
    (i) => `${uniqueDomainRetryCount = i}.${uniqueCanonicalDomain}`,
    flags
  );

  flags.push("canonical_name");
  let dohtestResults = await resolveWithRetry(DOH_TEST_DOMAIN, flags);
  let dohtestdotResults = await resolveWithRetry(DOH_TEST_DOT_DOMAIN, flags);

  await browser.telemetry.recordEvent(
    "doh.study.resolverusage",
    "resolve",
    "domains",
    "ok",
    {
      "dohtest": dohtestResults.substring(0, 80),       // Max length is 80 chars
      "dohtestdot": dohtestdotResults.substring(0, 80), // so truncate foreign
      "whoartthou": whoartthouResults.substring(0, 80), // data before sending
      "canonical": canonicalResults.substring(0, 80),
      uuid,
      "uuidRetries": uniqueDomainRetryCount.toString(),
    }
  );

  await browser.normandyAddonStudy.endStudy("fin");
}

main();
