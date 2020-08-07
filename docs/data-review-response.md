From https://github.com/mozilla-extensions/doh-resolver-usage-study/issues/1#issuecomment-670209896

data-review r+

1) Is there or will there be **documentation** that describes the schema for the ultimate data set in a public, complete, and accurate way?

Yes, in https://github.com/mozilla-extensions/doh-resolver-usage-study/blob/master/docs/TELEMETRY.md as referenced by the Firefox data docs. The Route 53 collection is described here.

2) Is there a control mechanism that allows the user to turn the data collection on and off?

Yes, the [Firefox telemetry opt-out](https://support.mozilla.org/en-US/kb/share-data-mozilla-help-improve-firefox) or by opting out of Normandy studies.

3) If the request is for permanent data collection, is there someone who will monitor the data over time?

n/a

4) Using the **[category system of data types](https://wiki.mozilla.org/Firefox/Data_Collection)** on the Mozilla wiki, what collection type of data do the requested measurements fall under?

Category 1, technical data.

5) Is the data collection request for default-on or default-off?

Default-on.

6) Does the instrumentation include the addition of **any *new* identifiers** (whether anonymous or otherwise; e.g., username, random IDs, etc.  See the appendix for more details)?

No. The collection involves "UUIDs" that are used as a join key between the telemetry collection and the Route 53 collection but these are not "identifiers" in the usual sense; they are nonces that are discarded after telemetry is reported. They do not outlive the client_id. They are formatted as UUIDs for convenience only.

7) Is the data collection covered by the existing Firefox privacy notice?

Yes.

8) Does there need to be a check-in in the future to determine whether to renew the data?

No.

9) Does the data collection use a third-party collection tool?

Yes, Route 53. Trust and Legal have approved the third-party collection.
