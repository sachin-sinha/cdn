
    const containerList = ["e0a657d4421841f7a877db03ecb4f5df"];
    var d = document,
    s = d.getElementsByTagName('script')[0];
    containerList.forEach(container => {
      fetch(`https://raw.githubusercontent.com/sachin-sinha/cdn/master/6000165802547722822/17e29e921cd64af2bfa58b09a2493b8f/${container}.js`)
      .then(response => response.text())
      .then(scriptText => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.text = scriptText;
        s.parentNode.insertBefore(script, s);
      });
    })
  