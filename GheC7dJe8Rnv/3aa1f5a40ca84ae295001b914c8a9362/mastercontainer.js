
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","58395a10ce7c4c35b5e75947434a35fe"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/GheC7dJe8Rnv/3aa1f5a40ca84ae295001b914c8a9362/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
