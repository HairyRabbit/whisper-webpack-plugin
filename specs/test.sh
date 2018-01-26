#!/usr/bin/env bash

cd specs

cd basic
yarn
yarn webpack
cd ..

cd moduleNotFoundError
yarn
yarn webpack
cd ..
