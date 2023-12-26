# -------------------------------------------------------------------------------
# SCRIPT PURPOSE AND USAGE
# -------------------------------------------------------------------------------

# This script is designed to streamline the process of managing various app settings
# for Android applications.

# It currently supports the following actions:
#   - Changing the app label name
#   - Updating the bundle ID

# To use the script:
#   1. Ensure you have Python3 installed on your system.
#   2. Verify that you have python by running the command on terminal python3 --version
#   3. Run the `yarn setting_script` script from the command line.

import os

# BUNDLE ID
# -----------------------------------------------

# Default app bundle ID: com.myreserp.paragon.fm.app (play store paragon bundle id do not change this)

# Existing bundle ID to be replaced
original_bundle_id = "com.sql_playground"

# Desired bundle ID to generate APK for
new_bundle_id = "com.sql_lite"

# -----------------------------------------------

# APP LABEL NAME

# +++++++++++++++++++++++++++++++++++++++++++++++

# Default app label name: ResERP (Remain unchanged)

# Existing app name to be replaced
original_app_name = "ResERP"

# Desired app nameyarn 
new_app_name = "ResERP_company"

# +++++++++++++++++++++++++++++++++++++++++++++++++++


# Replace occurrences of original bundle ID
os.system(f"sed -i 's/{original_bundle_id}/{new_bundle_id}/g' android/app/build.gradle")
os.system(f"sed -i 's/{original_bundle_id}/{new_bundle_id}/g' android/app/src/main/java/com/sqlplay/MainActivity.kt")
os.system(f"sed -i 's/{original_bundle_id}/{new_bundle_id}/g' android/app/src/main/java/com/sqlplay/MainApplication.kt")

# Replace occurrences of original app name

print(f"Build ID and app name updated successfully! Generated APK for:")
print(f"\t- {new_bundle_id} ({new_app_name})")

