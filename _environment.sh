#!/bin/bash
# Moves bbnc extensions files to desktop/temp

files=(
  G_BBNCExtensions_API.htm
  N_BBNCExtensions_API_Utility.htm
  T_BBNCExtensions_API_Utility_SecurePayments.htm
  M_BBNCExtensions_API_Utility_SecurePayments_TransactionResponse.htm
)

if [ "$1" == "dev" ]; then
  mv reference/bbncextensions/*.htm /Users/bobby.earl/Desktop/temp/
  for file in ${files[*]}
  do
    cp /Users/bobby.earl/Desktop/temp/$file reference/bbncextensions/
  done
elif [ "$1" == "prod" ]; then
  mv /Users/bobby.earl/Desktop/temp/*.htm reference/bbncextensions/
else
  echo 'You must provide the environment: dev or prod'
fi