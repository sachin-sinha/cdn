
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","d7a408872ee140a4ac32ba136bfb4423"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    fetch(`https://raw.githubusercontent.com/sachin-sinha/cdn/master/GheC7dJe8Rnv/1498bde1c59e420080aa5785924e8d5f/${container}.js`)
    .then(response => response.text())
    .then(scriptText => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.text = scriptText;
      s.parentNode.insertBefore(script, s);
    });
  })
