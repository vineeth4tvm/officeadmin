data.forEach(part => {
    var joiningdate = part.joiningdate.toString();
    console.log('joiningdate : '+ joiningdate)
    jyear = joiningdate.slice(0,4);
    jmonth = joiningdate.slice(4,6);
    jday = joiningdate.slice(6,8);
    part['joiningdate'] = jday+' '+jmonth+' '+jyear;
    console.log(jday+' '+jmonth+' '+jyear )
}); }
