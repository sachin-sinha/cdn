
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","bdddadce1c0247618b1829bff2a69a83"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/GheC7dJe8Rnv/1b90c3ca08b64664b1709e0779550986/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
