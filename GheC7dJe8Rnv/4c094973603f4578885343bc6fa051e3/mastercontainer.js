
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","9878e617f98445b69795ab368f81c16d"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/GheC7dJe8Rnv/4c094973603f4578885343bc6fa051e3/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
