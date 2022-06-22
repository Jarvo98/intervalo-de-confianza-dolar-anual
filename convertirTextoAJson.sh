#!/bin/bash
echo -n "["

for muestra in $(cat porcentajesDolarAnual.txt);do
	echo -n "${muestra},"
done

echo "]"
