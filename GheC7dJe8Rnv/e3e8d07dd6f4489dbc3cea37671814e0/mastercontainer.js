
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","9b84ddddbf004b4a9e05c88a5f3432b0"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/GheC7dJe8Rnv/e3e8d07dd6f4489dbc3cea37671814e0/${container}.js`;
    s.parentNode.insertBefore(script, s);
  })
