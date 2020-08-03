# DoH Resolver Usage Study

This add-on performs specific DNS lookups and sends the results via Telemetry.
The results of the lookups will allow us to measure the fraction of users who
appear to be on a Comcast network but whose networks are configured to use a
non-Comcast resolver. This will help verify the success-rate of CNAME-discovery
used by Firefox to steer DNS traffic to Comcast's DoH endpoint.
