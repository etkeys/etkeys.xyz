#!/usr/bin/env bash

ENV="$1"

ROOT_DIR="${PWD}"
PUBLISH_DIR="${ROOT_DIR}/.publish"

HUGO_DIRS=('eddie-webb_hugo-resume')

# Delete existing publish directory (if it exists) and remake it
([ -d "${PUBLISH_DIR}" ] && rm -rf "${PUBLISH_DIR:?.publish}/")
mkdir "${PUBLISH_DIR}"

# Iterate over all the hugo dirs, build them, and move static files to
# global publish dir.
for d in "${HUGO_DIRS[@]}"; do
    cd "src/${d}" || exit

    if [ "$1" == "PROD" ] ; then
        sed "s;baseURL: '';baseURL: 'https://etkeys.me'" config.yml
    else
        sed "s;baseURL: '';baseURL: 'https://test.etkeys.me'" config.yml
    fi

    hugo
    mv public/* "${PUBLISH_DIR}/"
done
