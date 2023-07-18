
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","9e88c9e2195e4cd0811d17b6f973d916"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    fetch(`https://raw.githubusercontent.com/sachin-sinha/cdn/master/GheC7dJe8Rnv/0511564ab407483eb599cedf8abb4b27/${container}.js`)
    .then(response => response.text())
    .then(scriptText => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.text = scriptText;
      s.parentNode.insertBefore(script, s);
    });
  })
