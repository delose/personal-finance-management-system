#!/bin/bash

jar tf target/discovery-server-0.0.1-SNAPSHOT.jar | grep MANIFEST.MF
jar xf target/discovery-server-0.0.1-SNAPSHOT.jar META-INF/MANIFEST.MF
cat META-INF/MANIFEST.MF

