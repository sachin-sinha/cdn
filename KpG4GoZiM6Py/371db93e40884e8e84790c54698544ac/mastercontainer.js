
  const containerList = ["5d29fdc5492d4b4498acb25e13c7c495"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/KpG4GoZiM6Py/371db93e40884e8e84790c54698544ac/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
