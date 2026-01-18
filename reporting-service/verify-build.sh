#!/usr/bin/env python3
# verify-build.py for Python

import os
import sys

dir_path = 'dist'

# Check if dist directory exists and is a directory
if os.path.isdir(dir_path):
    # Check if the directory is not empty
    if len(os.listdir(dir_path)) > 0:
        sys.exit(0) # Success: Artifact exists

sys.exit(1) # Failure: Artifact missing or directory is empty