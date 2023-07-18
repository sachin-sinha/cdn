
  const containerList = ["496ce8f65af94180b1b148723ff3e9c5","7ea3742c3f574a0c9b1f2bc0c705abe1"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    fetch(`https://raw.githubusercontent.com/sachin-sinha/cdn/master/GheC7dJe8Rnv/6096e063a743492e955d96f1fff4ee33/${container}.js`)
    .then(response => response.text())
    .then(scriptText => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.text = scriptText;
      s.parentNode.insertBefore(script, s);
    });
  })
