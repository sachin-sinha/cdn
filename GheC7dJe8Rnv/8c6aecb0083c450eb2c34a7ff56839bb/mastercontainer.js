
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","9129b0a3e8294bd0b9372832d98e2f5e"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    fetch(`https://raw.githubusercontent.com/sachin-sinha/cdn/master/GheC7dJe8Rnv/8c6aecb0083c450eb2c34a7ff56839bb/${container}.js`)
    .then(response => response.text())
    .then(scriptText => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.text = scriptText;
      s.parentNode.insertBefore(script, s);
    });
  })
