
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","3e1a4716b29f427790bb402ce4b73296"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/GheC7dJe8Rnv/e62ad63425d84880b565fd6342a8fbe9/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
