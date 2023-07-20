
  const containerList = ["2ff4b107cab6413da251b5ee0088ec62"];
  var d = document,
  s = d.getElementsByTagName('script')[0];
  containerList.forEach(container => {
    fetch(`https://raw.githubusercontent.com/sachin-sinha/cdn/master/GheC7dJe8Rnv/fdfd3921dd8541baa02f0c535a8aca4b/${container}.js`)
    .then(response => response.text())
    .then(scriptText => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      // script.async = true;
      script.text = scriptText;
      s.parentNode.insertBefore(script, s);
    });
  })
