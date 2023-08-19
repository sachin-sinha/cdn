
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","3acfe89b8eca4ea7877662576437f6d8"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/GheC7dJe8Rnv/b3b45928b5ea4e488eb56074e20f5983/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
