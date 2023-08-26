
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","5d702a5016a64d78b8a317a31f210352"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/GheC7dJe8Rnv/38bf8f991b9742119f9cc2de0aa8aef7/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
