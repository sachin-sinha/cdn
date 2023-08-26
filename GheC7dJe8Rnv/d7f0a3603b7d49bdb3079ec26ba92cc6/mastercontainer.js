
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","e6c937cb5a9e4c67a2812259d5db252b"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/GheC7dJe8Rnv/d7f0a3603b7d49bdb3079ec26ba92cc6/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
