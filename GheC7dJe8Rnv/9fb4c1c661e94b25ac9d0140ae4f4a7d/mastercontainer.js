
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","9aa52c4183d64eb7950437eaa5636a97"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    fetch(`https://raw.githubusercontent.com/sachin-sinha/cdn/master/GheC7dJe8Rnv/9fb4c1c661e94b25ac9d0140ae4f4a7d/${container}.js`)
    .then(response => response.text())
    .then(scriptText => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.text = scriptText;
      s.parentNode.insertBefore(script, s);
    });
  })
