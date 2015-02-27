for d in */ ; 
do
    cd "/Users/robertlyons/supersonicGistofit/app/$d"
    filename=$d
    cp ~/gistofit/steroids-composer/Gistofit/app/controllers/${filename/\//.js} scripts/.
done
