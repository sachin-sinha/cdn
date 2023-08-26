
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","c4bd4454c72145c29e4cd188f94d2c5c"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/GheC7dJe8Rnv/8f1351508c5c467f86f72d22aed89977/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
